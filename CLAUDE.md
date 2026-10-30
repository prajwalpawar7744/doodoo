# CLAUDE.md

## Project

doodoo is a multiplayer Pictionary game. This repo holds the frontend in `client` and the backend in `server`. `plan.md` is the source of truth for the roadmap and the client↔server event contract — keep it in sync when the contract changes. Backend progress is tracked step by step in `server/ROADMAP.md`; build one step at a time and let the user test it before moving on.

## Frontend (`client`)

- React 19 + Vite, plain JavaScript (`.jsx`), no TypeScript.
- Styling: Tailwind CSS v4 utilities only; theme tokens live in `@theme` in `src/index.css`. No separate component CSS files.
- Fonts: Bagel Fat One via `font-display` for headings, Nunito for body; both self-hosted with `@fontsource`.
- Icons: `lucide-react`. Conditional classes: `clsx`.
- Dev server runs on port 3000 (`vite.config.js`).

Commands (run inside `client`):

```bash
npm run dev
npm run build
npm run lint
```

## Backend (`server`)

- Node (CommonJS) + Express 5 + Socket.IO, plain JavaScript. State is in memory, no database; identity is a guest nickname, no accounts.
- Listens on port 4000 (`PORT`); `CORS_ORIGIN` defaults to the client at `http://localhost:3000`.
- Implemented so far: nickname login (`auth: { nickname }` on connect -> `auth:ok`, or `bad_nickname`) and rooms (`room:create`, `room:join`, `room:state`) in `main.js` + `src/rooms/RoomManager.js`. Disconnect handling (player removed, host passes to the next player, empty rooms deleted) plus `room:leave` and host-only `room:kick` are in too. Game logic and drawing are not built yet.

Commands (run inside `server`):

```bash
npm run dev   # nodemon on :4000
npm start
```

## Conventions

- Commit messages use Conventional Commits: `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`, lowercase subject.
- The server owns the word, timer, and scoring; the client only renders state it receives.
- Canvas coordinates sent over the wire are normalized to 0–1.
