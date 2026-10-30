# Backend roadmap: Scribble-style game

Each step is small, testable on its own, and ends with a manual check before the next one starts. Event names follow the contract in `../plan.md`. Working code for steps 2–9 exists in a backup and can be brought back one step at a time.

| # | Step | You can test by | Status |
|---|---|---|---|
| 1 | **Nickname login**: connect with `auth: { nickname }`, server validates (1–20 chars), replies `auth:ok {id, nickname}` or rejects with `bad_nickname` | Connect a client with a good and a bad nickname | done |
| 2 | **Rooms**: `room:create {name}` -> ack `{roomId}`, `room:join {roomId, name}` with `not_found` / `full` / `bad_name` errors, `room:state` broadcast, player list, host assignment | Two clients: create, join, see both in `room:state` | next |
| 3 | **Leaving & host handling**: disconnect removes a player, host passes on, empty rooms are deleted | Close a tab, watch `room:state` update | |
| 4 | **Game start**: `game:start {rounds, drawTime}` (host only, min 2 players), turn order, phases `lobby/choosing/drawing/turnEnd` | Host starts, phase changes in `room:state` | |
| 5 | **Word choice**: `turn:choose` (drawer only) -> `turn:pick {word}`, auto-pick timeout, `turn:start {drawerId, wordLength, endsAt}`, `turn:word` to drawer | Drawer sees 3 words; others only see length | |
| 6 | **Drawing relay**: `draw:stroke` / `draw:clear` / `draw:undo`, drawer-only, input validation, coords 0–1, rate limit | Draw in one tab, see it in another | |
| 7 | **Guessing & chat**: `guess`, `chat:message` (`guess` / `correct` / `system`), word never leaks, solved players' chat hidden from others | Guess wrong and right | |
| 8 | **Hints & timer**: `hint {masked}` with progressive letter reveal, turn ends on timeout or when all have guessed | Watch letters appear | |
| 9 | **Scoring & end of game**: time-based points, `turn:end {word, scores}`, `game:end {leaderboard}`, back to lobby for "Play again" | Play a full 2-round game | |
| 10 | **Reconnect**: 30s grace period, `playerId` rebinds the seat, replay current turn and strokes to the returning client | Refresh the tab mid-game | |
| 11 | **Hardening**: payload validation everywhere, per-socket rate limits, stroke-history cap, graceful shutdown | Automated tests with bad payloads | |
| 12 | **Automated tests**: integration suite with `socket.io-client` (`npm test`) | `npm test` is green | |
| 13 | **Docs sync**: update `../plan.md` and `../CLAUDE.md` with the final contract and server commands | Review | |

## Later (after the core game works)
- Public room list (`rooms:list`) and quick-join
- Custom word lists and room settings (word count, hints on/off)
- Close-guess feedback ("so close!") and profanity filter
- Persistence and real accounts (database, JWT) instead of guest nicknames
- Scale-out: Redis adapter for Socket.IO and shared room state
- Deployment: Dockerfile, env config, health checks

## Decisions already made
- Socket.IO, in-memory state, guest nicknames, private rooms only (join by code).
- Server owns the word, timer and scoring; the client only renders.
- Backend port 4000 (client dev server uses 3000).
