import { getRedisClient } from "../redis-client";
import { defaultRateLimitSettings } from "./constants";
import { toPositiveInteger } from "./utils";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type GlobalWithRateLimit = typeof globalThis & {
  __contactRateLimitStore?: Map<string, RateLimitEntry>;
};

export type RateLimitResult = {
  limited: boolean;
  retryAfterSeconds: number | null;
};

export type RateLimitSettings = {
  maxRequestsPerBurstByIp: number;
  maxRequestsPerDayByIp: number;
  maxRequestsPerDayByEmail: number;
};

const getRateLimitStore = (): Map<string, RateLimitEntry> => {
  const scope = globalThis as GlobalWithRateLimit;
  scope.__contactRateLimitStore ??= new Map<string, RateLimitEntry>();
  return scope.__contactRateLimitStore;
};

const pruneExpiredRateLimitEntries = (
  store: Map<string, RateLimitEntry>,
  now: number,
): void => {
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
};

export const getClientIp = (request: Request): string | null => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");
    const parsed = firstIp?.trim();
    if (parsed) {
      return parsed;
    }
  }

  const fallbackHeaders = [
    "x-real-ip",
    "cf-connecting-ip",
    "fly-client-ip",
    "x-vercel-forwarded-for",
  ];

  for (const header of fallbackHeaders) {
    const ip = request.headers.get(header)?.trim();
    if (ip) {
      return ip;
    }
  }

  return null;
};

export const isAllowedBrowserSubmission = (request: Request): boolean => {
  const requestOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (!origin && !referer) {
    return false;
  }

  if (origin && origin !== requestOrigin) {
    return false;
  }

  if (referer) {
    try {
      if (new URL(referer).origin !== requestOrigin) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
};

const isRateLimitedInMemory = (
  key: string,
  windowMs: number,
  maxRequests: number,
): RateLimitResult => {
  const now = Date.now();
  const store = getRateLimitStore();
  pruneExpiredRateLimitEntries(store, now);
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { limited: false, retryAfterSeconds: null };
  }

  if (entry.count >= maxRequests) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((entry.resetAt - now) / 1000),
    );
    return { limited: true, retryAfterSeconds };
  }

  entry.count += 1;
  store.set(key, entry);
  return { limited: false, retryAfterSeconds: null };
};

export const isRateLimited = async (
  key: string,
  windowMs: number,
  maxRequests: number,
): Promise<RateLimitResult> => {
  const redis = getRedisClient();
  if (!redis) {
    return isRateLimitedInMemory(key, windowMs, maxRequests);
  }

  const redisKey = `contact:rate-limit:${key}`;

  try {
    const count = await redis.incr(redisKey);
    if (count === 1) {
      await redis.pexpire(redisKey, windowMs);
    }

    if (count > maxRequests) {
      const ttlMs = await redis.pttl(redisKey);
      const effectiveTtlMs =
        typeof ttlMs === "number" && ttlMs > 0 ? ttlMs : windowMs;
      const retryAfterSeconds = Math.max(1, Math.ceil(effectiveTtlMs / 1000));
      return { limited: true, retryAfterSeconds };
    }

    return { limited: false, retryAfterSeconds: null };
  } catch {
    return isRateLimitedInMemory(key, windowMs, maxRequests);
  }
};

export const getRateLimitSettings = (): RateLimitSettings => ({
  maxRequestsPerBurstByIp: toPositiveInteger(
    process.env.CONTACT_RATE_LIMIT_BURST_PER_MINUTE,
    defaultRateLimitSettings.maxRequestsPerBurstByIp,
  ),
  maxRequestsPerDayByIp: toPositiveInteger(
    process.env.CONTACT_RATE_LIMIT_IP_PER_DAY,
    defaultRateLimitSettings.maxRequestsPerDayByIp,
  ),
  maxRequestsPerDayByEmail: toPositiveInteger(
    process.env.CONTACT_RATE_LIMIT_EMAIL_PER_DAY,
    defaultRateLimitSettings.maxRequestsPerDayByEmail,
  ),
});
