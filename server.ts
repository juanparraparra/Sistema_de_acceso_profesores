import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { initMongoDB } from './server/db.js';
import { authRouter } from './server/routes/auth.js';
import { usersRouter } from './server/routes/users.js';
import { databaseRouter } from './server/routes/database.js';

dotenv.config();

const PORT = 3000;
const HOST = '0.0.0.0';

async function startServer() {
  const app = express();

  // Basic middleware
  app.use(cors());
  app.use(express.json());

  // Initialize MongoDB connection
  await initMongoDB();

  // 1. API routes FIRST
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Portal Profesores API',
      timestamp: new Date().toISOString(),
      platform: 'Node.js + Express + MongoDB',
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/database', databaseRouter);

  // 2. Vite Middleware or Production Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Server] Vite middleware montado en modo desarrollo.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Server] Sirviendo build estático de producción.');
  }

  app.listen(PORT, HOST, () => {
    console.log(`[Server] Servidor backend ejecutándose en http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Error fatal al iniciar el servidor:', err);
  process.exit(1);
});
