# doodoo — web client

Frontend for **doodoo**, a multiplayer Pictionary game: one player draws, everyone else races to guess the word.

## Stack

- React 19 + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- lucide-react icons, clsx
- Socket.IO client (planned) for real-time play

## Getting started

```bash
cd client
npm install
npm run dev      # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Run ESLint |

## Configuration

| Variable | Purpose |
|---|---|
| `VITE_SERVER_URL` | Backend Socket.IO URL (planned) |

## Roadmap

See [`plan.md`](../plan.md) at the repo root for the event contract with the backend, screens, and canvas plan.
