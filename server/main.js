const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cfg = require('./src/config');

function cleanNickname(v) {
  if (typeof v !== 'string') return null;
  const n = v.trim().replace(/\s+/g, ' ');
  return n.length >= cfg.MIN_NAME_LEN && n.length <= cfg.MAX_NAME_LEN ? n : null;
}

function createServer() {
  const app = express();
  app.get('/health', (req, res) => res.json({ ok: true }));
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: cfg.CORS_ORIGIN.split(',') } });

  // Login: the client connects with `auth: { nickname }`.
  io.use((socket, next) => {
    const nickname = cleanNickname(socket.handshake.auth && socket.handshake.auth.nickname);
    if (!nickname) return next(new Error('bad_nickname'));
    socket.data.user = { id: socket.id, nickname };
    next();
  });

  io.on('connection', (socket) => {
    socket.emit('auth:ok', socket.data.user);
  });

  return { server, io };
}

if (require.main === module) {
  createServer().server.listen(cfg.PORT, () => console.log(`doodoo server on :${cfg.PORT}`));
}

module.exports = { createServer };
