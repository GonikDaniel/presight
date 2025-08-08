import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { generateMockData, getTopHobbiesAndNationalities } from './utils/mockData';
import streamingRoutes from './routes/streaming.js';
import workerRoutes, { setSocketIO } from './routes/worker';
import type { QueryParams, UsersResponse, FiltersResponse } from './types';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Generate mock data on server start (1000 records)
let mockData = generateMockData(1000);

// Routes
app.get('/api/users', (req, res) => {
  try {
    const {
      page = '1',
      limit = '20',
      search = '',
      nationality = '',
      hobbies = '',
    }: QueryParams = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let filteredData = [...mockData];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchLower) ||
          user.last_name.toLowerCase().includes(searchLower)
      );
    }

    // Apply nationality filter
    if (nationality) {
      filteredData = filteredData.filter(
        (user) => user.nationality.toLowerCase() === nationality.toLowerCase()
      );
    }

    // Apply hobbies filter
    if (hobbies) {
      const hobbyArray = hobbies.split(',').map((h) => h.trim().toLowerCase());
      filteredData = filteredData.filter((user) =>
        user.hobbies.some((hobby) => hobbyArray.includes(hobby.toLowerCase()))
      );
    }

    // Calculate pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredData.length / limitNum);

    const response: UsersResponse = {
      data: paginatedData,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: filteredData.length,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/filters', (req, res) => {
  try {
    const { topHobbies, topNationalities } = getTopHobbiesAndNationalities(mockData);
    const response: FiltersResponse = {
      topHobbies,
      topNationalities,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Streaming routes
app.use(streamingRoutes);

// Worker routes
app.use(workerRoutes);

// Set up WebSocket for worker routes
setSocketIO(io);

// WebSocket connection handling
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
