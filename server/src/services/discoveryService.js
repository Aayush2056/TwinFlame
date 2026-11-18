import fs from 'fs';
import path from 'path';
import { getIsMongoConnected } from '../config/db.js';
import { getCache, invalidateCachePrefix, setCache } from '../config/redis.js';
import { MatchModel } from '../models/Match.js';
import { ProfileModel } from '../models/Profile.js';
import { SwipeModel } from '../models/Swipe.js';
import { SEED_PROFILES } from '../seed/profiles.js';
import { HttpError } from '../middleware/errorHandler.js';
import { toPublicProfile } from '../utils/profileMapper.js';

const LOCAL_DATA_DIR = path.resolve(import.meta.dirname, '..', '..', 'data');
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, 'twinflame-db.json');
const FEED_CACHE_TTL_SECONDS = 120;
const MATCHES_CACHE_TTL_SECONDS = 120;

function readLocalDb() {
  if (!fs.existsSync(LOCAL_DATA_DIR)) {
    fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(LOCAL_DATA_FILE)) {
    const initial = {
      profiles: SEED_PROFILES,
      swipes: [],
      matches: [],
    };
    writeLocalDb(initial);
    return initial;
  }

  try {
    const raw = fs.readFileSync(LOCAL_DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.profiles) || parsed.profiles.length < SEED_PROFILES.length) {
      parsed.profiles = SEED_PROFILES;
      writeLocalDb(parsed);
    }
    return {
      profiles: parsed.profiles,
      swipes: Array.isArray(parsed.swipes) ? parsed.swipes : [],
      matches: Array.isArray(parsed.matches) ? parsed.matches : [],
    };
  } catch {
    const reset = {
      profiles: SEED_PROFILES,
      swipes: [],
      matches: [],
    };
    writeLocalDb(reset);
    return reset;
  }
}

function writeLocalDb(state) {
  if (!fs.existsSync(LOCAL_DATA_DIR)) {
    fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  }
  const tempPath = `${LOCAL_DATA_FILE}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(state, null, 2), 'utf-8');
  fs.renameSync(tempPath, LOCAL_DATA_FILE);
}

export async function ensureSeedProfiles() {
  if (getIsMongoConnected()) {
    await ProfileModel.bulkWrite(
      SEED_PROFILES.map(({ id, ...profile }) => ({
        updateOne: {
          filter: { slug: profile.slug },
          update: {
            $set: profile,
          },
          upsert: true,
        },
      }))
    );

    console.info(`[Seed] Synced ${SEED_PROFILES.length} profiles with MongoDB.`);
    return;
  }

  readLocalDb();
}

export async function getFeed({ userId, page, limit }) {
  const cacheKey = `feed:${userId}:p:${page}:l:${limit}`;

  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  let response;

  if (getIsMongoConnected()) {
    const [swipes, totalMatches, totalCatalog] = await Promise.all([
      SwipeModel.find({ actorId: userId }).select('targetProfileId').lean(),
      MatchModel.countDocuments({ userId }),
      ProfileModel.countDocuments({ isActive: true }),
    ]);

    const swipedIds = swipes.map((s) => s.targetProfileId);
    const filter = {
      isActive: true,
      ...(swipedIds.length > 0 ? { _id: { $nin: swipedIds } } : {}),
    };

    const totalRemaining = await ProfileModel.countDocuments(filter);
    const docs = await ProfileModel.find(filter)
      .sort({ _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    response = {
      profiles: docs.map((doc) => toPublicProfile(doc)),
      pagination: {
        page,
        limit,
        totalRemaining,
        hasMore: page * limit < totalRemaining,
      },
      stats: {
        totalSwiped: swipedIds.length,
        totalMatches,
        totalCatalog,
      },
    };
  } else {
    const db = readLocalDb();
    const userSwipes = db.swipes.filter((s) => s.actorId === userId);
    const swipedSet = new Set(userSwipes.map((s) => s.targetProfileId));
    const activeCatalog = db.profiles.filter((p) => p.isActive);
    const remaining = activeCatalog.filter((p) => !swipedSet.has(p.id));
    const start = (page - 1) * limit;
    const paged = remaining.slice(start, start + limit);
    const userMatches = db.matches.filter((m) => m.userId === userId);

    response = {
      profiles: paged.map((p) => toPublicProfile(p)),
      pagination: {
        page,
        limit,
        totalRemaining: remaining.length,
        hasMore: start + limit < remaining.length,
      },
      stats: {
        totalSwiped: userSwipes.length,
        totalMatches: userMatches.length,
        totalCatalog: activeCatalog.length,
      },
    };
  }

  await setCache(cacheKey, response, FEED_CACHE_TTL_SECONDS);
  return response;
}

export async function recordSwipe({ userId, profileId, action }) {
  if (getIsMongoConnected()) {
    const target = await ProfileModel.findOne({ _id: profileId, isActive: true })
      .select('+hasLikedCurrentUser')
      .lean();

    if (!target) {
      throw new HttpError(404, 'Profile not found or inactive.', 'PROFILE_NOT_FOUND');
    }

    const existingSwipe = await SwipeModel.findOne({
      actorId: userId,
      targetProfileId: profileId,
    }).lean();

    if (existingSwipe) {
      throw new HttpError(409, 'You have already swiped on this profile.', 'DUPLICATE_SWIPE');
    }

    const createdSwipe = await SwipeModel.create({
      actorId: userId,
      targetProfileId: profileId,
      action,
    });

    const isMutual = action === 'like' && Boolean(target.hasLikedCurrentUser);
    let matchDto = null;

    if (isMutual) {
      const existingMatch = await MatchModel.findOne({
        userId,
        matchedProfileId: profileId,
      }).lean();

      const matchDoc =
        existingMatch ||
        (await MatchModel.create({
          userId,
          matchedProfileId: profileId,
          matchedAt: new Date(),
        }));

      matchDto = {
        id: String(matchDoc._id),
        matchedAt: new Date(matchDoc.matchedAt).toISOString(),
        profile: toPublicProfile(target),
      };
    }

    await Promise.all([
      invalidateCachePrefix(`feed:${userId}:`),
      invalidateCachePrefix(`matches:${userId}`),
    ]);

    return {
      swipe: {
        profileId,
        action,
        createdAt: createdSwipe.createdAt.toISOString(),
      },
      isMatch: isMutual,
      match: matchDto,
    };
  }

  const db = readLocalDb();
  const target = db.profiles.find((p) => p.id === profileId && p.isActive);
  if (!target) {
    throw new HttpError(404, 'Profile not found or inactive.', 'PROFILE_NOT_FOUND');
  }

  const duplicate = db.swipes.find(
    (s) => s.actorId === userId && s.targetProfileId === profileId
  );
  if (duplicate) {
    throw new HttpError(409, 'You have already swiped on this profile.', 'DUPLICATE_SWIPE');
  }

  const now = new Date().toISOString();
  const newSwipe = {
    id: `swp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    actorId: userId,
    targetProfileId: profileId,
    action,
    createdAt: now,
  };
  db.swipes.push(newSwipe);

  const isMutual = action === 'like' && Boolean(target.hasLikedCurrentUser);
  let matchDto = null;

  if (isMutual) {
    let existingMatch = db.matches.find(
      (m) => m.userId === userId && m.matchedProfileId === profileId
    );
    if (!existingMatch) {
      existingMatch = {
        id: `mth_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        userId,
        matchedProfileId: profileId,
        matchedAt: now,
      };
      db.matches.push(existingMatch);
    }
    matchDto = {
      id: existingMatch.id,
      matchedAt: existingMatch.matchedAt,
      profile: toPublicProfile(target),
    };
  }

  writeLocalDb(db);

  await Promise.all([
    invalidateCachePrefix(`feed:${userId}:`),
    invalidateCachePrefix(`matches:${userId}`),
  ]);

  return {
    swipe: {
      profileId,
      action,
      createdAt: now,
    },
    isMatch: isMutual,
    match: matchDto,
  };
}

export async function getMatches(userId) {
  const cacheKey = `matches:${userId}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  let matches = [];

  if (getIsMongoConnected()) {
    const docs = await MatchModel.find({ userId }).sort({ matchedAt: -1 }).lean();
    const profileIds = docs.map((d) => d.matchedProfileId);
    const profiles = await ProfileModel.find({
      _id: { $in: profileIds },
      isActive: true,
    }).lean();

    const profileMap = new Map(profiles.map((p) => [String(p._id), toPublicProfile(p)]));

    matches = docs
      .map((doc) => {
        const profile = profileMap.get(doc.matchedProfileId);
        if (!profile) return null;
        return {
          id: String(doc._id),
          matchedAt: new Date(doc.matchedAt).toISOString(),
          profile,
        };
      })
      .filter((item) => item !== null);
  } else {
    const db = readLocalDb();
    const profileMap = new Map(
      db.profiles.filter((p) => p.isActive).map((p) => [p.id, toPublicProfile(p)])
    );

    matches = db.matches
      .filter((m) => m.userId === userId)
      .sort((a, b) => new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime())
      .map((m) => {
        const profile = profileMap.get(m.matchedProfileId);
        if (!profile) return null;
        return {
          id: m.id,
          matchedAt: m.matchedAt,
          profile,
        };
      })
      .filter((item) => item !== null);
  }

  const result = { matches, total: matches.length };
  await setCache(cacheKey, result, MATCHES_CACHE_TTL_SECONDS);
  return result;
}

export async function resetUserDiscovery(userId) {
  if (getIsMongoConnected()) {
    await Promise.all([
      SwipeModel.deleteMany({ actorId: userId }),
      MatchModel.deleteMany({ userId }),
    ]);
  } else {
    const db = readLocalDb();
    db.swipes = db.swipes.filter((s) => s.actorId !== userId);
    db.matches = db.matches.filter((m) => m.userId !== userId);
    writeLocalDb(db);
  }

  await Promise.all([
    invalidateCachePrefix(`feed:${userId}:`),
    invalidateCachePrefix(`matches:${userId}`),
  ]);
}
