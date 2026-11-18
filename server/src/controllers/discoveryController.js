import { env } from '../config/env.js';
import { getIsMongoConnected } from '../config/db.js';
import { isRedisAvailable } from '../config/redis.js';
import {
  getFeed,
  getMatches,
  recordSwipe,
  resetUserDiscovery,
} from '../services/discoveryService.js';
import { feedQuerySchema, swipeBodySchema } from '../validators/swipeValidator.js';

function resolveUserId(req) {
  const headerUser = req.header('x-user-id');
  return headerUser && headerUser.trim() ? headerUser.trim() : env.defaultUserId;
}

export async function handleGetFeed(req, res, next) {
  try {
    const query = feedQuerySchema.parse(req.query);
    const userId = resolveUserId(req);
    const data = await getFeed({
      userId,
      page: query.page,
      limit: query.limit,
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function handlePostSwipe(req, res, next) {
  try {
    const body = swipeBodySchema.parse(req.body);
    const userId = resolveUserId(req);
    const result = await recordSwipe({
      userId,
      profileId: body.profileId,
      action: body.action,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function handleGetMatches(req, res, next) {
  try {
    const userId = resolveUserId(req);
    const data = await getMatches(userId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function handleResetDemo(req, res, next) {
  try {
    const userId = resolveUserId(req);
    await resetUserDiscovery(userId);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

export function handleHealthCheck(_req, res) {
  res.json({
    ok: true,
    database: getIsMongoConnected() ? 'mongodb' : 'local-persistent-json',
    cache: isRedisAvailable() ? 'redis' : 'memory-ttl-fallback',
  });
}
