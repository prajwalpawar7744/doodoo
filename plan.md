# Doodoo — Frontend Plan

Pictionary game. Frontend lives in `client` (Vite + React 19, JavaScript). Backend is built separately; this plan keeps the two unblocked via a shared event contract and a local mock server.

## Stack

- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`; theme tokens in `@theme` in `src/index.css`.
- **Font:** Fredoka (Google Fonts) as `font-display` for headings and the word hint.
- **Icons:** `lucide-react` (e.g. `Pencil`, `Eraser`, `Undo2`, `Trash2`, `Timer`, `Crown`, `Send`).
- **Utilities:** `clsx` for conditional class names.
- **Later:** `motion` for animations.

## Phase 0 — Event contract (agree with backend first)

Transport: **Socket.IO** (rooms, reconnection, acks built in).

| Direction | Event | Payload |
|---|---|---|
| C→S | `room:create` | `{ name }` → ack `{ roomId }` |
| C→S | `room:join` | `{ roomId, name }` |
| S→C | `room:state` | `{ players: [{ id, name, score }], hostId, phase, round, maxRounds }` |
| C→S | `game:start` | `{ rounds, drawTime }` (host only) |
| S→C | `turn:start` | `{ drawerId, wordLength, endsAt }` |
| S→C (drawer only) | `turn:choose` | `{ options: [] }` |
| C→S | `turn:pick` | `{ word }` |
| S→C (drawer only) | `turn:word` | `{ word }` |
| C→S → S→C | `draw:stroke` | `{ points: [[x, y]], color, size, tool }` — coords normalized 0–1 |
| C→S → S→C | `draw:clear`, `draw:undo` | `{}` |
| C→S | `guess` | `{ text }` |
| S→C | `chat:message` | `{ playerId, text, kind: 'guess' \| 'correct' \| 'system' }` |
| S→C | `hint` | `{ masked: "_ a _ _" }` |
| S→C | `turn:end` | `{ word, scores }` |
| S→C | `game:end` | `{ leaderboard }` |

The server owns the word, timer, and scoring. The client only renders them.

## Phase 1 — Foundations

- Add `socket.io-client` and `react-router-dom`.
- `src/net/socket.js` — singleton socket, URL from `VITE_SERVER_URL`.
- `src/state/GameContext.jsx` — `useReducer` store fed by `room:*` / `turn:*` events.
- `mock-server/index.js` — small Socket.IO server implementing the contract so UI work isn't blocked. Swap to the real backend by changing the env var.

## Phase 2 — Screens

1. **Home** (`/`) — enter name, create room or join by code.
2. **Lobby** (`/room/:id`) — player list, copy invite link, host settings, Start.
3. **Game** (same route, switched on `phase`) — canvas, chat/guess input, scoreboard, timer, word hint, drawer's word picker.
4. **Results** — round-end overlay and final leaderboard with "Play again".

## Phase 3 — Canvas

- `Canvas.jsx` using Pointer Events (mouse, touch, stylus); responsive, DPR-scaled.
- Batch points every ~30–50 ms before emitting.
- Replay remote strokes for guessers; keep a stroke list for undo and late-joiner redraw.
- Toolbar: color palette, brush sizes, eraser, undo, clear. Drawing locked for non-drawers.

## Phase 4 — Polish

- Timer derived from server `endsAt` (no drift).
- Reconnect banner; auto-rejoin with stored name + room.
- Sounds on correct guesses, mobile layout, visual styling.

## Folder layout

```
client/
  src/
    net/        socket.js, protocol.js
    state/      GameContext.jsx, reducer.js
    pages/      Home.jsx, Room.jsx
    components/ Canvas.jsx, Toolbar.jsx, Chat.jsx, Scoreboard.jsx,
                Timer.jsx, WordHint.jsx, WordPicker.jsx
  mock-server/  index.js
```

## Open questions (frontend + backend)

- Socket.IO or raw WebSocket?
- Scoring formula — time-based?
- Drawer picks from 3 words, or auto-assigned?
- Private rooms only, or a public lobby list too?
