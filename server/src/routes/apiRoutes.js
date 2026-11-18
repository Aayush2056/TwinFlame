import { Router } from 'express';
import {
  handleGetFeed,
  handleGetMatches,
  handleHealthCheck,
  handlePostSwipe,
  handleResetDemo,
} from '../controllers/discoveryController.js';
import {
  createFeedRateLimiter,
  createMatchesRateLimiter,
  createSwipeRateLimiter,
} from '../middleware/rateLimiter.js';

export function createApiRouter() {
  const router = Router();

  const feedLimiter = createFeedRateLimiter();
  const swipeLimiter = createSwipeRateLimiter();
  const matchesLimiter = createMatchesRateLimiter();

  router.get('/health', handleHealthCheck);
  router.get('/feed', feedLimiter, handleGetFeed);
  router.post('/swipe', swipeLimiter, handlePostSwipe);
  router.get('/matches', matchesLimiter, handleGetMatches);
  router.post('/demo/reset', swipeLimiter, handleResetDemo);

  return router;
}
