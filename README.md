# Presight Frontend Exercise

1. Create a mock api to serve paginated list of information with filtering and search capabilities

   - Define a data object having the following
     - avatar
     - first_name
     - last_name
     - age
     - nationality
     - hobbies (list of 0 to 10 items)
   - Display the list as individual cards using virtual scroll component, subsequent pages must be loaded using infinite scroll technique (preferably using `@tanstack/react-virtual`)
   - Design the card as
     ```
     |----------------------------------|
     | avatar      first_name+last_name |
     |             nationality      age |
     |                                  |
     |             (2 hobbies) (+n)     |
     |----------------------------------|
     ```
     > display top 2 hobbies and show remaining count if applicable as _`+n`_
   - Provide a side list in page to show top 20 hobbies and nationality that can be applied as filters
   - Provide a searchbox to find and filter the data by first_name, last_name

2. Read http response as stream and create a display that will print the response one character at a time

   - Create an api that responds with long text (`faker.lorem.paragraphs(32)`)
   - Read the response as a stream, while the stream is open display the available response one character at a time
   - Once the stream is closed print entire response

3. Create an api that will process each request in webworker and respond with the result over websocket

   - The api endpoint must cache each request into an in-memory queue and respond with `pending`
   - The queued requests must be processed in a webworker, the worker should send a result over websockets (for the exercise a text result can be sent after a timeout of 2seconds)
   - In react show 20 items that correspond to 20 requests, display `pending` for each of the requests and display corresponding result on receiving the websocket result

   > request --> `pending` --> socket message --> `result`

---

## Run with Docker (one command)

From the repo root:

```bash
docker compose up --build
```

- Client: `http://localhost:3000`
- Server: `http://localhost:5001`

## Local development (without Docker)

1. Install dependencies at the repo root (monorepo workspaces):

```bash
yarn install
```

2. Start the server (default port 5001):

```bash
yarn --cwd server dev
```

- Custom port examples:
  - Using CLI flag: `yarn --cwd server dev -- --port 5050`
  - Using env: `PORT=5050 yarn --cwd server dev`

3. Start the client (default port 3000):

```bash
yarn --cwd client dev
```

Client expects the API at `http://localhost:5001` by default.

## Production builds

- Server:

  ```bash
  yarn --cwd server build
  yarn --cwd server start
  ```

- Client:
  ```bash
  yarn --cwd client build
  # optional preview on a local server
  yarn --cwd client preview
  ```

## Tests (server)

```bash
yarn --cwd server test
# or
yarn --cwd server test:users
yarn --cwd server test:worker
```

## Useful URLs

- Health: `http://localhost:5001/api/health`
- Users: `http://localhost:5001/api/users`
- Filters: `http://localhost:5001/api/filters`
- Text streaming: `http://localhost:5001/api/stream-text`
