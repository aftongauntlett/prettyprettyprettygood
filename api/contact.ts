import { getRedisClient } from "./redis-client";

const resendApiUrl = "https://api.resend.com/emails";
const turnstileVerifyUrl =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const suspiciousRedirectPath = "/?contact=error#contact";
const resendTimeoutMs = 8000;
const turnstileTimeoutMs = 5000;
const burstWindowMs = 60 * 1000;
const dailyWindowMs = 24 * 60 * 60 * 1000;
const defaultMaxRequestsPerBurstByIp = 6;
const defaultMaxRequestsPerDayByIp = 30;
const defaultMaxRequestsPerDayByEmail = 8;
const minSubmissionTimeMs = 3000;
const maxSubmissionAgeMs = 2 * 60 * 60 * 1000;
const maxNameLength = 120;
const maxEmailLength = 254;
const maxOrgLength = 160;
const maxExistingSiteLength = 2048;
const maxMessageLength = 5000;
const maxContributionModelLength = 40;
const maxBudgetContextLength = 1000;

const allowedContributionModels = new Set([
  "free-needed",
  "sliding-scale",
  "budget",
  "not-sure",
]);

const formatContributionModel = (value: string): string => {
  switch (value) {
    case "free-needed":
      return "Fully free is needed right now";
    case "sliding-scale":
      return "Can contribute on a sliding scale";
    case "budget":
      return "Has a real budget and happy to contribute";
    case "not-sure":
      return "Not sure yet";
    default:
      return "Not provided";
  }
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type GlobalWithRateLimit = typeof globalThis & {
  __contactRateLimitStore?: Map<string, RateLimitEntry>;
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const asString = (value: FormDataEntryValue | null): string =>
  typeof value === "string" ? value.trim() : "";

const toNumber = (value: string): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toPositiveInteger = (
  value: string | undefined,
  fallback: number,
): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const normalizeEmail = (value: string): string => value.trim().toLowerCase();

const isLikelyEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isLikelyHttpUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const sha256Hex = async (value: string): Promise<string> => {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return toHex(new Uint8Array(hashBuffer));
};

const redirectTo = (requestUrl: string, path: string): Response => {
  const url = new URL(path, requestUrl);
  return Response.redirect(url, 303);
};

const wantsJsonResponse = (request: Request): boolean => {
  if (request.headers.get("x-contact-ajax") === "1") {
    return true;
  }

  const accept = request.headers.get("accept")?.toLowerCase() ?? "";
  return accept.includes("application/json");
};

const jsonResponse = (body: { ok: boolean }, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

const jsonResponseWithHeaders = (
  body: { ok: boolean },
  status: number,
  headers: Record<string, string>,
): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    },
  });

const rejectSubmission = (
  request: Request,
  reason: string,
  clientIp: string | null,
  status = 400,
  retryAfterSeconds: number | null = null,
): Response => {
  console.warn("contact_submission_rejected", {
    reason,
    method: request.method,
    hasClientIp: Boolean(clientIp),
  });

  if (wantsJsonResponse(request)) {
    if (status === 429 && retryAfterSeconds) {
      return jsonResponseWithHeaders({ ok: false }, status, {
        "Retry-After": String(retryAfterSeconds),
      });
    }

    return jsonResponse({ ok: false }, status);
  }

  return redirectTo(request.url, suspiciousRedirectPath);
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

const getClientIp = (request: Request): string | null => {
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

const isAllowedBrowserSubmission = (request: Request): boolean => {
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
): { limited: boolean; retryAfterSeconds: number | null } => {
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

const isRateLimited = async (
  key: string,
  windowMs: number,
  maxRequests: number,
): Promise<{ limited: boolean; retryAfterSeconds: number | null }> => {
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

const getRateLimitSettings = () => ({
  maxRequestsPerBurstByIp: toPositiveInteger(
    process.env.CONTACT_RATE_LIMIT_BURST_PER_MINUTE,
    defaultMaxRequestsPerBurstByIp,
  ),
  maxRequestsPerDayByIp: toPositiveInteger(
    process.env.CONTACT_RATE_LIMIT_IP_PER_DAY,
    defaultMaxRequestsPerDayByIp,
  ),
  maxRequestsPerDayByEmail: toPositiveInteger(
    process.env.CONTACT_RATE_LIMIT_EMAIL_PER_DAY,
    defaultMaxRequestsPerDayByEmail,
  ),
});

type TurnstileVerifyResult = {
  success?: boolean;
  hostname?: string;
  "error-codes"?: string[];
};

const verifyTurnstileToken = async (
  token: string,
  secret: string,
  clientIp: string | null,
  expectedHostname: string,
): Promise<boolean> => {
  if (!token) {
    return false;
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (clientIp) {
    body.set("remoteip", clientIp);
  }

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort("turnstile-timeout");
  }, turnstileTimeoutMs);

  try {
    const response = await fetch(turnstileVerifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      signal: timeoutController.signal,
    });

    if (!response.ok) {
      return false;
    }

    const result = (await response.json()) as TurnstileVerifyResult;
    if (!result.success) {
      return false;
    }

    if (result.hostname && result.hostname !== expectedHostname) {
      return false;
    }

    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const config = {
  runtime: "edge",
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        Allow: "POST",
      },
    });
  }

  if (!isAllowedBrowserSubmission(request)) {
    return rejectSubmission(request, "origin_or_referer_invalid", null);
  }

  const clientIp = getClientIp(request);

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim() ?? "";
  const rateLimits = getRateLimitSettings();

  if (!apiKey || !fromEmail || !toEmail) {
    return rejectSubmission(request, "email_provider_unconfigured", clientIp);
  }

  const formData = await request.formData();
  const name = asString(formData.get("name"));
  const email = asString(formData.get("email"));
  const org = asString(formData.get("org"));
  const message = asString(formData.get("message"));
  const existingSite = asString(formData.get("existing-site"));
  const contributionModel = asString(formData.get("contribution-model"));
  const budgetContext = asString(formData.get("budget-context"));
  const hpField = asString(formData.get("project-url"));
  const startedAtRaw = asString(formData.get("form-started-at"));
  const turnstileToken = asString(formData.get("cf-turnstile-response"));
  const normalizedEmail = normalizeEmail(email);

  if (hpField) {
    return rejectSubmission(request, "honeypot_triggered", clientIp);
  }

  if (!name || !normalizedEmail || !message || !contributionModel) {
    return rejectSubmission(request, "missing_required_fields", clientIp);
  }

  if (!allowedContributionModels.has(contributionModel)) {
    return rejectSubmission(request, "invalid_contribution_model", clientIp);
  }

  if (
    name.length > maxNameLength ||
    normalizedEmail.length > maxEmailLength ||
    org.length > maxOrgLength ||
    existingSite.length > maxExistingSiteLength ||
    message.length > maxMessageLength ||
    contributionModel.length > maxContributionModelLength ||
    budgetContext.length > maxBudgetContextLength
  ) {
    return rejectSubmission(request, "field_length_limit_exceeded", clientIp);
  }

  if (!isLikelyEmail(normalizedEmail)) {
    return rejectSubmission(request, "invalid_email", clientIp);
  }

  if (existingSite && !isLikelyHttpUrl(existingSite)) {
    return rejectSubmission(request, "invalid_existing_site_url", clientIp);
  }

  const startedAt = toNumber(startedAtRaw);
  const now = Date.now();
  if (!startedAt) {
    return rejectSubmission(request, "missing_or_invalid_started_at", clientIp);
  }

  const elapsedMs = now - startedAt;
  if (elapsedMs < minSubmissionTimeMs || elapsedMs > maxSubmissionAgeMs) {
    return rejectSubmission(request, "submission_timing_invalid", clientIp);
  }

  if (turnstileSecret) {
    const expectedHostname = new URL(request.url).hostname;
    const turnstileOk = await verifyTurnstileToken(
      turnstileToken,
      turnstileSecret,
      clientIp,
      expectedHostname,
    );

    if (!turnstileOk) {
      return rejectSubmission(
        request,
        "turnstile_verification_failed",
        clientIp,
      );
    }
  }

  if (clientIp) {
    const burstLimit = await isRateLimited(
      `ip:${clientIp}:burst`,
      burstWindowMs,
      rateLimits.maxRequestsPerBurstByIp,
    );
    if (burstLimit.limited) {
      return rejectSubmission(
        request,
        "ip_burst_rate_limited",
        clientIp,
        429,
        burstLimit.retryAfterSeconds,
      );
    }

    const dailyIpLimit = await isRateLimited(
      `ip:${clientIp}:day`,
      dailyWindowMs,
      rateLimits.maxRequestsPerDayByIp,
    );
    if (dailyIpLimit.limited) {
      return rejectSubmission(
        request,
        "ip_daily_rate_limited",
        clientIp,
        429,
        dailyIpLimit.retryAfterSeconds,
      );
    }
  }

  const emailHash = await sha256Hex(normalizedEmail);
  const dailyEmailLimit = await isRateLimited(
    `email:${emailHash}:day`,
    dailyWindowMs,
    rateLimits.maxRequestsPerDayByEmail,
  );
  if (dailyEmailLimit.limited) {
    return rejectSubmission(
      request,
      "email_daily_rate_limited",
      clientIp,
      429,
      dailyEmailLimit.retryAfterSeconds,
    );
  }

  const html = `
    <h2>New project inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(normalizedEmail)}</p>
    <p><strong>Organization or project:</strong> ${escapeHtml(org || "Not provided")}</p>
    <p><strong>Funding preference:</strong> ${escapeHtml(formatContributionModel(contributionModel))}</p>
    <p><strong>Budget context:</strong> ${escapeHtml(budgetContext || "Not provided")}</p>
    <p><strong>Existing website:</strong> ${escapeHtml(existingSite || "Not provided")}</p>
    <h3>Message</h3>
    <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
  `;

  let sendResponse: Response;

  try {
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => {
      timeoutController.abort("resend-timeout");
    }, resendTimeoutMs);

    try {
      sendResponse = await fetch(resendApiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: normalizedEmail,
          subject: `New project inquiry from ${name}`,
          html,
        }),
        signal: timeoutController.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    const isTimeout =
      error instanceof DOMException && error.name === "AbortError";
    console.error("contact_email_send_failed", {
      reason: isTimeout ? "timeout" : "request_exception",
      timeoutMs: resendTimeoutMs,
      method: request.method,
      endpoint: resendApiUrl,
      hasClientIp: Boolean(clientIp),
    });
    if (wantsJsonResponse(request)) {
      return jsonResponse({ ok: false }, 502);
    }

    return redirectTo(request.url, suspiciousRedirectPath);
  }

  if (!sendResponse.ok) {
    let providerBody = "";
    try {
      providerBody = await sendResponse.text();
    } catch {
      providerBody = "";
    }

    console.error("contact_email_send_failed", {
      reason: "provider_non_ok",
      timeoutMs: resendTimeoutMs,
      method: request.method,
      endpoint: resendApiUrl,
      status: sendResponse.status,
      statusText: sendResponse.statusText,
      providerBody: providerBody.slice(0, 500),
      hasClientIp: Boolean(clientIp),
    });
    if (wantsJsonResponse(request)) {
      return jsonResponse({ ok: false }, 502);
    }

    return redirectTo(request.url, suspiciousRedirectPath);
  }

  if (wantsJsonResponse(request)) {
    return jsonResponse({ ok: true }, 200);
  }

  return redirectTo(request.url, "/?contact=sent#contact");
}
