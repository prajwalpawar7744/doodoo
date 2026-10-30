# Doodoo — Frontend Plan

Pictionary game. Frontend lives in `client` (Vite + React 19, JavaScript). Backend is built separately; this plan keeps the two unblocked via a shared event contract and a local mock server.

## Stack

- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`; theme tokens in `@theme` in `src/index.css`.
- **Font:** Fredoka (Google Fonts) as `font-display` for headings and the word hint.
- **Icons:** `lucide-react` (e.g. `Pencil`, `Eraser`, `Undo2`, `Trash2`, `Timer`, `Crown`, `Send`).
- **Utilities:** `clsx` for conditional class names.
- **Animation:** `motion` (Framer Motion).
- **Riso components:** `src/components/riso/` (PaperGround, RisoText, StampButton, Doodles, InkFilters).

## Phase 0 — Event contract (agree with backend first)

Transport: **Socket.IO** (rooms, reconnection, acks built in).

**Login (implemented in `server`):** the client connects with `io(url, { auth: { nickname } })`. The server trims the nickname (1–20 chars) and replies `auth:ok { id, nickname }`; an invalid nickname is rejected with a `connect_error` whose message is `bad_nickname`. `id` is the socket id for now. Backend steps are tracked in `server/ROADMAP.md`; `room:create`, `room:join` and `room:state` are implemented too; everything after them is the target contract and not built yet.

| Direction | Event | Payload |
|---|---|---|
| C→S (handshake) | connect with `auth: { nickname }` | 1–20 chars after trim; rejected with `connect_error` `bad_nickname` |
| S→C | `auth:ok` | `{ id, nickname }` |
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

- [x] `react-router-dom` added; routes `/` and `/name` in `src/App.jsx`.
- Add `socket.io-client`.
- `src/net/socket.js` — singleton socket, URL from `VITE_SERVER_URL`.
- `src/state/GameContext.jsx` — `useReducer` store fed by `room:*` / `turn:*` events.
- `mock-server/index.js` — small Socket.IO server implementing the contract so UI work isn't blocked. Swap to the real backend by changing the env var.

## Phase 2 — Screens

1. [x] **Home** (`/`) — riso title screen, "Hop in & doodle!" goes to `/name`.
   [x] **Name** (`/name`) — enter name (2–16 chars, saved to localStorage), then Start a room / Join with code (not wired to the backend yet).
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
