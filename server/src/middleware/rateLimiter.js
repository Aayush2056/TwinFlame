import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedisClient, isRedisAvailable } from '../config/redis.js';

function buildLimiter(options) {
  const client = getRedisClient();

  const store =
    client && isRedisAvailable()
      ? new RedisStore({
          prefix: `rl:${options.prefix}:`,
          sendCommand: (...args) => client.call(args[0], ...args.slice(1)),
        })
      : undefined;

  return rateLimit({
    windowMs: options.windowMs,
    limit: options.limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    store,
    handler: (_req, res) => {
      res.status(429).json({
        error: options.message,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfterSeconds: Math.ceil(options.windowMs / 1000),
      });
    },
  });
}

export function createFeedRateLimiter() {
  return buildLimiter({
    windowMs: 60 * 1000,
    limit: 120,
    prefix: 'feed',
    message: 'Feed rate limit exceeded. Please pause briefly before loading more profiles.',
  });
}

export function createSwipeRateLimiter() {
  return buildLimiter({
    windowMs: 60 * 1000,
    limit: 60,
    prefix: 'swipe',
    message: 'Swipe rate limit exceeded. Please slow down before swiping again.',
  });
}

export function createMatchesRateLimiter() {
  return buildLimiter({
    windowMs: 60 * 1000,
    limit: 120,
    prefix: 'matches',
    message: 'Matches rate limit exceeded. Please try again shortly.',
  });
}
