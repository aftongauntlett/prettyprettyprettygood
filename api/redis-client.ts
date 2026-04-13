import { Redis } from "@upstash/redis";

type GlobalWithRedis = typeof globalThis & {
  __sharedRedisClient?: Redis | null;
};

export const getRedisClient = (): Redis | null => {
  const scope = globalThis as GlobalWithRedis;
  if (scope.__sharedRedisClient !== undefined) {
    return scope.__sharedRedisClient;
  }

  const redisUrl =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ??
    process.env.KV_REST_API_URL?.trim() ??
    "";
  const redisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ??
    process.env.KV_REST_API_TOKEN?.trim() ??
    "";

  if (!redisUrl || !redisToken) {
    scope.__sharedRedisClient = null;
    return null;
  }

  scope.__sharedRedisClient = new Redis({
    url: redisUrl,
    token: redisToken,
  });
  return scope.__sharedRedisClient;
};
