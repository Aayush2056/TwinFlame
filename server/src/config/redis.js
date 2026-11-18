import Redis from 'ioredis';
import { env } from './env.js';

const memoryFallback = new Map();
let redisClient = null;
let redisReady = false;

export async function connectRedis() {
  if (redisClient) return redisClient;

  const client = new Redis(env.redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy(times) {
      if (times > 2) return null;
      return Math.min(times * 200, 1000);
    },
  });

  client.on('ready', () => {
    redisReady = true;
    console.info('[Redis] Connected to Redis at', env.redisUrl);
  });

  client.on('error', () => {
    redisReady = false;
  });

  client.on('close', () => {
    redisReady = false;
  });

  try {
    await client.connect();
    redisClient = client;
    redisReady = true;
    return client;
  } catch {
    redisReady = false;
    try {
      client.disconnect();
    } catch {
      // ignore disconnect errors
    }
    redisClient = null;
    console.info('[Redis] Local Redis unavailable — using in-memory TTL cache fallback.');
    return null;
  }
}

export function getRedisClient() {
  return redisReady ? redisClient : null;
}

export function isRedisAvailable() {
  return redisReady && redisClient !== null;
}

export async function getCache(key) {
  if (redisReady && redisClient) {
    try {
      const raw = await redisClient.get(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      // Fall back cleanly if Redis temporarily fails
    }
  }

  const entry = memoryFallback.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryFallback.delete(key);
    return null;
  }
  return JSON.parse(entry.value);
}

export async function setCache(key, value, ttlSeconds = 120) {
  const serialized = JSON.stringify(value);
  if (redisReady && redisClient) {
    try {
      await redisClient.setex(key, ttlSeconds, serialized);
      return;
    } catch {
      // Fall back cleanly
    }
  }

  memoryFallback.set(key, {
    value: serialized,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export async function invalidateCachePrefix(prefix) {
  if (redisReady && redisClient) {
    try {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await redisClient.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 100);
        cursor = nextCursor;
        if (keys.length > 0) {
          await redisClient.del(...keys);
        }
      } while (cursor !== '0');
    } catch {
      // ignore Redis scan failures
    }
  }

  for (const key of memoryFallback.keys()) {
    if (key.startsWith(prefix)) {
      memoryFallback.delete(key);
    }
  }
}
