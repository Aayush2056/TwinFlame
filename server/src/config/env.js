import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  mongodbUri: process.env.MONGODB_URI || '',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  defaultUserId: 'twinflame-demo-user',
};
