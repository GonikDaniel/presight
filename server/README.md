# Presight Backend Server

## Overview

Node.js + Express + TypeScript backend providing:

- Users API with pagination, search, and filtering
- Filters API (top hobbies, top nationalities)
- Text streaming API (character-by-character)
- Worker API backed by an in-memory queue with WebSocket results

Runs on `http://localhost:5001`.

## Features

### 1) Users & Filters

- `GET /api/health` — health check
- `GET /api/users` — pagination + search + `nationality` + `hobbies`
- `GET /api/filters` — top hobbies and nationalities

Response shapes:

- Users

```json
{
  "data": [
    {
      "id": 1,
      "avatar": "https://...",
      "first_name": "John",
      "last_name": "Doe",
      "age": 25,
      "nationality": "American",
      "hobbies": ["Reading", "Gaming"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 50,
    "totalItems": 1000,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

- Filters

```json
{
  "topHobbies": [{ "hobby": "Reading", "count": 156 }],
  "topNationalities": [{ "nationality": "American", "count": 45 }]
}
```

### 2) Text Streaming

- `GET /api/stream-text` — streams `faker.lorem.paragraphs(32)` one character at a time with a small delay
- `GET /api/stream-text/:speed` — same, with adjustable delay (ms)

Headers:

- `Content-Type: text/plain`
- `Connection: keep-alive`

### 3) Worker Queue + WebSocket

- `POST /api/worker/submit` — returns `{ requestId, status: "pending", message }`, processing starts in background
- `GET /api/worker/status/:requestId` — returns current request status
- `GET /api/worker/requests` — returns all in-memory queued requests
- `DELETE /api/worker/clear` — clears queue and counters

Processing simulates a 2s job, then emits over WebSocket:

- Event: `request-completed` → `{ requestId, result, timestamp }`
- Errors: `request-error`

Socket.IO is initialized in the server and passed into worker routes. CORS for WS is enabled for `http://localhost:3000`.

## Tech

- Express
- TypeScript (ES Modules)
- Socket.IO
- @faker-js/faker

## Project Structure

```
src/
├── index.ts               # App bootstrap, middleware, route mounting, Socket.IO setup
├── routes/
│   ├── users.ts           # /api/users, /api/filters, /api/health
│   ├── streaming.ts       # /api/stream-text, /api/stream-text/:speed
│   └── worker.ts          # /api/worker/* endpoints + setSocketIO()
├── utils/
│   └── mockData.ts        # Mock data generation + top filters aggregation
└── types/
    └── index.ts           # Shared server-side interfaces
```

## Setup

1. Install deps at repo root (monorepo):

```bash
yarn install
```

2. Dev server:

```bash
yarn dev
```

3. Build & run (production):

```bash
yarn build
yarn start
```

- Default port: `5001`

## Testing (Jest)

Scripts:

```bash
yarn test          # run all tests
yarn test:watch    # watch mode
yarn test:coverage # coverage

# individual suites
yarn test:health
yarn test:users
yarn test:streaming
yarn test:worker
```

Test suites live in `tests/`:

- `health.test.ts` — basics
- `users.test.ts` — users + filters
- `streaming.test.ts` — streaming headers + first chunk verification
- `worker.test.ts` — queue submit/status/list/clear

## Notes

- ES Modules are enabled (`"type": "module"`). Build outputs to `dist/`.
- Streaming endpoints are intentionally slow for demo; client tests avoid reading full streams.
- In-memory queue is ephemeral; restart clears data.
- CORS is enabled for the frontend dev server (`http://localhost:3000`).
