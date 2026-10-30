const crypto = require('crypto');
const cfg = require('../config');

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no look-alike characters

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  newId() {
    let id;
    do {
      id = Array.from(crypto.randomBytes(6), (b) => ALPHABET[b % ALPHABET.length]).join('');
    } while (this.rooms.has(id));
    return id;
  }

  create() {
    const room = { id: this.newId(), players: [], hostId: null, phase: 'lobby', round: 0, maxRounds: cfg.DEFAULT_ROUNDS };
    this.rooms.set(room.id, room);
    return room;
  }

  get(id) {
    return this.rooms.get(String(id || '').trim().toUpperCase());
  }

  // Returns an error code, or null on success.
  addPlayer(room, id, name) {
    if (room.players.length >= cfg.MAX_PLAYERS) return 'full';
    room.players.push({ id, name, score: 0 });
    if (!room.hostId) room.hostId = id;
    return null;
  }

  state(room) {
    const { players, hostId, phase, round, maxRounds } = room;
    return { players, hostId, phase, round, maxRounds };
  }
}

module.exports = RoomManager;
