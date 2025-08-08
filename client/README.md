# Presight Frontend Client

## Overview

React + TypeScript app with three views:

- User Cards (virtualized, infinite scroll)
- Text Streaming (character-by-character streaming with stop/reset)
- Worker Requests (submit jobs, receive results via WebSocket)

Backend runs on `http://localhost:5001`.
Frontend runs on `http://localhost:3000`.

## Features

### 1) User Cards

- Virtualized grid (3 cards per row on desktop) via `@tanstack/react-virtual`
- Infinite scrolling via `@tanstack/react-query`'s `useInfiniteQuery`
- Debounced search, filter by nationality and hobbies
- Lightweight `SimpleSelect` inputs
- Tight spacing, no container border

### 2) Text Streaming

- Streams long text (faker.lorem.paragraphs(32)) one char at a time
- Live display with auto-scroll, cursor animation and char counter
- Controls: Start, Stop (cancels stream), Reset
- Optional speed param: `GET /api/stream-text/:speed`

### 3) Worker Requests

- Submit requests that are processed asynchronously on the server
- Server emits results via WebSocket (`socket.io`)
- UI shows 20 items: `pending` -> `completed` with returned text
- Clear-all and basic connection status

## Tech

- React 18+ + TypeScript
- Vite
- Tailwind CSS 3
- @tanstack/react-query, @tanstack/react-virtual
- axios
- socket.io-client

## Scripts

```bash
# Dev
yarn dev

# Build
yarn build

# Preview built app
yarn preview

# Lint
yarn lint
yarn lint:fix
```

## Project Structure (client/src)

```
app entry
- App.tsx                     # View switcher: 'user-cards' | 'text-streaming' | 'worker-requests'
- main.tsx                    # React root
- index.css                   # Tailwind setup + global styles

components
- FiltersPanel.tsx            # Search + filters (debounced)
- ViewModeSelector.tsx        # View radio group
- UserCardsView.tsx           # Wrapper for virtualized list
- TextStreamView.tsx          # Wrapper for text streaming display
- VirtualizedUsersList.tsx    # Virtualized rows (3 cards/row) + infinite scroll
- TextStreamingDisplay.tsx    # Streaming UI (start/stop/reset)
- WorkerRequestsView.tsx      # Submit/display worker request statuses
- UserCard.tsx                # Individual user card

services
- api.ts                      # users/filters/http
- textStreamingApi.ts         # fetch + ReadableStream helpers
- workerApi.ts                # worker REST endpoints
- websocketService.ts         # socket.io client wrapper

types
- index.ts                    # Shared app types (incl. ViewMode)

hooks
- useDebounce.ts              # Debounced value for search
```

## Usage

1. Install deps at repo root (monorepo):

```bash
yarn install
```

2. Run backend (in `server/`):

```bash
yarn dev
```

3. Run frontend (in `client/`):

```bash
yarn dev
```

## API (used by client)

- `GET /api/users` — pagination + search + `nationality` + `hobbies`
- `GET /api/filters` — top hobbies and nationalities
- `GET /api/stream-text` — long text as a stream
- `GET /api/stream-text/:speed` — adjustable streaming speed
- Worker endpoints: `POST /api/worker/submit`, `GET /api/worker/status/:id`, `GET /api/worker/requests`, `DELETE /api/worker/clear`

## Notes

- `ViewMode` type is centralized: `'user-cards' | 'text-streaming' | 'worker-requests'` and reused across components.
- Virtualization is per-row to preserve the 3-cards-per-row layout on desktop.
