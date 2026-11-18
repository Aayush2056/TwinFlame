import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { connectDatabase } from './src/config/db.js';
import { connectRedis } from './src/config/redis.js';
import { createExpressApp } from './src/app.js';
import { ensureSeedProfiles } from './src/services/discoveryService.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

async function startBackend() {
  try {
    await Promise.all([
      connectDatabase(),
      connectRedis()
    ]);

    await ensureSeedProfiles();

    const app = createExpressApp();

    const assetsDir = path.resolve(
      import.meta.dirname,
      '..',
      'client',
      'src',
      'assets'
    );

    if (fs.existsSync(assetsDir)) {
      app.use('/src/assets', express.static(assetsDir));
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 TwinFlame Backend running on port: ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('[TwinFlame Backend] Startup failure:', err);
    process.exit(1);
  }
}

startBackend();