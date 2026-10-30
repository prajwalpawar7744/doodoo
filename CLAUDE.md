# CLAUDE.md

## Project

doodoo is a multiplayer Pictionary game. This repo holds the frontend in `client`; the backend is built separately by another developer. `plan.md` is the source of truth for the roadmap and the client↔server event contract — keep it in sync when the contract changes.

## Frontend (`client`)

- React 19 + Vite, plain JavaScript (`.jsx`), no TypeScript.
- Styling: Tailwind CSS v4 utilities only; theme tokens live in `@theme` in `src/index.css`. No separate component CSS files.
- Fonts: Fredoka via `font-display` for headings.
- Icons: `lucide-react`. Conditional classes: `clsx`.
- Dev server runs on port 3000 (`vite.config.js`).

Commands (run inside `client`):

```bash
npm run dev
npm run build
npm run lint
```

## Conventions

- Commit messages use Conventional Commits: `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`, lowercase subject.
- The server owns the word, timer, and scoring; the client only renders state it receives.
- Canvas coordinates sent over the wire are normalized to 0–1.
