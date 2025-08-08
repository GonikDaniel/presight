import { Router } from 'express';
import { faker } from '@faker-js/faker';

const router = Router();

// In-memory queue for requests
interface QueuedRequest {
  id: string;
  timestamp: number;
  status: 'pending' | 'processing' | 'completed';
  result?: string;
}

const requestQueue: Map<string, QueuedRequest> = new Map();
let requestCounter = 0;

const generateRequestId = (): string => {
  return `req_${Date.now()}_${++requestCounter}`;
};

// Process request in web worker (simulated)
const processRequest = async (): Promise<string> => {
  // Simulate web worker processing with 2-second timeout
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Generate a random text result
  const result = faker.lorem.paragraph();

  return result;
};

// WebSocket connection handling
let io: any = null;

export const setSocketIO = (socketIO: any) => {
  io = socketIO;
};

// API endpoint to submit a request
router.post('/api/worker/submit', (req, res) => {
  try {
    const requestId = generateRequestId();

    // Add request to queue
    const queuedRequest: QueuedRequest = {
      id: requestId,
      timestamp: Date.now(),
      status: 'pending',
    };

    requestQueue.set(requestId, queuedRequest);

    // Start processing the request
    processRequest()
      .then((result) => {
        // Update request status
        const request = requestQueue.get(requestId);
        if (request) {
          request.status = 'completed';
          request.result = result;
          requestQueue.set(requestId, request);

          // Send result via WebSocket
          if (io) {
            io.emit('request-completed', {
              requestId,
              result,
              timestamp: Date.now(),
            });
          }
        }
      })
      .catch((error) => {
        console.error('Error processing request:', error);

        if (io) {
          io.emit('request-error', {
            requestId,
            error: 'Processing failed',
            timestamp: Date.now(),
          });
        }
      });

    // Respond with pending status
    res.json({
      requestId,
      status: 'pending',
      message: 'Request queued for processing',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({
      error: 'Failed to submit request',
      timestamp: Date.now(),
    });
  }
});

// API endpoint to get request status
router.get('/api/worker/status/:requestId', (req, res) => {
  try {
    const { requestId } = req.params;
    const request = requestQueue.get(requestId);

    if (!request) {
      return res.status(404).json({
        error: 'Request not found',
        timestamp: Date.now(),
      });
    }

    res.json({
      requestId,
      status: request.status,
      result: request.result,
      timestamp: request.timestamp,
    });
  } catch (error) {
    console.error('Error getting request status:', error);
    res.status(500).json({
      error: 'Failed to get request status',
      timestamp: Date.now(),
    });
  }
});

// API endpoint to get all requests
router.get('/api/worker/requests', (req, res) => {
  try {
    const requests = Array.from(requestQueue.values()).map((request) => ({
      id: request.id,
      status: request.status,
      result: request.result,
      timestamp: request.timestamp,
    }));

    res.json({
      requests,
      total: requests.length,
      pending: requests.filter((r) => r.status === 'pending').length,
      completed: requests.filter((r) => r.status === 'completed').length,
    });
  } catch (error) {
    console.error('Error getting requests:', error);
    res.status(500).json({
      error: 'Failed to get requests',
      timestamp: Date.now(),
    });
  }
});

// API endpoint to clear all requests
router.delete('/api/worker/clear', (req, res) => {
  try {
    requestQueue.clear();
    requestCounter = 0;

    res.json({
      message: 'All requests cleared',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error clearing requests:', error);
    res.status(500).json({
      error: 'Failed to clear requests',
      timestamp: Date.now(),
    });
  }
});

export default router;
