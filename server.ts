/**
 * Bubu & Dudu: A Cozy Co-op Adventure
 * Full-Stack Entry Point: Express Server + WebSocket Multi-User Hub + Vite Middlewares
 */

import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupWebSocketServer } from './server/websocket/wsHandler.ts';
import { roomManager } from './server/rooms/RoomManager.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  const server = http.createServer(app);

  // Mount WebSocket Server on /ws
  const wss = new WebSocketServer({ server, path: '/ws' });
  setupWebSocketServer(wss);

  // REST API Endpoints
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: Date.now() });
  });

  app.get('/api/rooms/:id', (req, res) => {
    const roomId = req.params.id?.toUpperCase();
    const room = roomManager.getRoom(roomId);
    if (!room) {
      return res.status(404).json({ exists: false, message: 'Ruangan tidak ditemukan' });
    }
    return res.json({
      exists: true,
      roomId: room.id,
      playerCount: room.players.size,
      isFull: room.players.size >= 2,
      levelId: room.levelId,
    });
  });

  // Vite development middleware or static production serving
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎮 Bubu & Dudu Server running on port ${PORT}`);
    console.log(`🌐 WebSocket mounted on ws://0.0.0.0:${PORT}/ws`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
