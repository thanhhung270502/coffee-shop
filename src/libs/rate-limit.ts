import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { AppError } from "./errors";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

type RateLimitConfig = {
  requests: number;
  window: `${number} s` | `${number} m` | `${number} h` | `${number} d`;
};

function getIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0]?.trim() : "unknown";
  return ip ?? "unknown";
}

export async function rateLimit(
  request: Request,
  prefix: string,
  config: RateLimitConfig,
): Promise<void> {
  const client = getRedis();
  if (!client) {
    return;
  }

  const limiter = new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    prefix: `rl:${prefix}`,
  });

  const identifier = getIdentifier(request);
  const { success, remaining } = await limiter.limit(identifier);

  if (!success) {
    throw new AppError(`Too many requests. Please try again later. (${remaining} remaining)`, 429);
  }
}
