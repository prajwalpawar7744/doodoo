const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cfg = require('./src/config');
const RoomManager = require('./src/rooms/RoomManager');

function cleanNickname(v) {
  if (typeof v !== 'string') return null;
  const n = v.trim().replace(/\s+/g, ' ');
  return n.length >= cfg.MIN_NAME_LEN && n.length <= cfg.MAX_NAME_LEN ? n : null;
}

const noop = () => {};

function createServer() {
  const rooms = new RoomManager();
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

    // Name defaults to the login nickname when the payload has none.
    const nameFrom = (payload) => (payload && payload.name != null ? cleanNickname(payload.name) : socket.data.user.nickname);

    socket.on('room:create', (payload, cb = noop) => {
      if (typeof cb !== 'function') cb = noop;
      if (socket.data.roomId) return cb({ error: 'already_in_room' });
      const name = nameFrom(payload);
      if (!name) return cb({ error: 'bad_name' });
      const room = rooms.create();
      rooms.addPlayer(room, socket.id, name);
      socket.join(room.id);
      socket.data.roomId = room.id;
      cb({ roomId: room.id });
      io.to(room.id).emit('room:state', rooms.state(room));
    });

    socket.on('room:join', (payload, cb = noop) => {
      if (typeof cb !== 'function') cb = noop;
      if (socket.data.roomId) return cb({ ok: false, error: 'already_in_room' });
      const room = rooms.get(payload && payload.roomId);
      if (!room) return cb({ ok: false, error: 'not_found' });
      const name = nameFrom(payload);
      if (!name) return cb({ ok: false, error: 'bad_name' });
      const error = rooms.addPlayer(room, socket.id, name);
      if (error) return cb({ ok: false, error });
      socket.join(room.id);
      socket.data.roomId = room.id;
      cb({ ok: true, roomId: room.id });
      io.to(room.id).emit('room:state', rooms.state(room));
    });

    socket.on('disconnect', () => {
      const room = rooms.get(socket.data.roomId);
      if (!room) return;
      if (!rooms.removePlayer(room, socket.id)) io.to(room.id).emit('room:state', rooms.state(room));
    });
  });

  return { server, io };
}

if (require.main === module) {
  createServer().server.listen(cfg.PORT, () => console.log(`doodoo server on :${cfg.PORT}`));
}

module.exports = { createServer };
