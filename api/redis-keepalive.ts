import { getRedisClient } from "./redis-client";

const jsonResponse = (
  body: Record<string, string | boolean | number>,
  status: number,
): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

const isAuthorizedCronRequest = (request: Request): boolean => {
  const secret = process.env.CRON_SECRET?.trim() ?? "";
  if (!secret) {
    return false;
  }

  const header = request.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
};

export const config = {
  runtime: "edge",
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return jsonResponse({ ok: false, error: "method_not_allowed" }, 405);
  }

  if (!isAuthorizedCronRequest(request)) {
    return jsonResponse({ ok: false, error: "unauthorized" }, 401);
  }

  const redis = getRedisClient();
  if (!redis) {
    return jsonResponse({ ok: false, error: "redis_unconfigured" }, 500);
  }

  const now = Date.now();
  const key = "contact:keepalive:last-seen";

  try {
    await redis.set(key, String(now));
    return jsonResponse({ ok: true, key, timestamp: now }, 200);
  } catch {
    return jsonResponse({ ok: false, error: "redis_keepalive_failed" }, 502);
  }
}
