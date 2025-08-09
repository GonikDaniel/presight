import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/users';
import streamingRoutes from './routes/streaming';
import workerRoutes, { setSocketIO } from './routes/worker';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const app = express();
const server = createServer(app);

const argv = yargs(hideBin(process.argv))
  .option('port', {
    type: 'number',
    describe: 'The port on which the server runs',
  })
  .parseSync();

const PORT = Number(argv.port ?? process.env.PORT ?? 5001);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(userRoutes);
app.use(streamingRoutes);
app.use(workerRoutes);

// WebSocket setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
setSocketIO(io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Users API: http://localhost:${PORT}/api/users`);
  console.log(`Filters API: http://localhost:${PORT}/api/filters`);
});
