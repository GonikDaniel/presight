import fetch from 'node-fetch';
import { waitForServer } from './setup';
import type { WorkerResponse } from '../src/types';

const BASE_URL = global.BASE_URL || 'http://localhost:5001/api';

describe('Worker API', () => {
  beforeAll(async () => {
    await waitForServer();
  });

  beforeEach(async () => {
    // Clear the queue before each test
    await fetch(`${BASE_URL}/worker/clear`, { method: 'DELETE' });
  });

  describe('POST /api/worker/submit', () => {
    it('should submit a request and return pending status', async () => {
      const response = await fetch(`${BASE_URL}/worker/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: 'test request' }),
      });

      const data: WorkerResponse = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('pending');
      expect(data.requestId).toBeDefined();
      expect(typeof data.requestId).toBe('string');
      expect(data.message).toBe('Request queued for processing');
      expect(data.timestamp).toBeDefined();
    });

    it('should handle different request data', async () => {
      const testData = {
        message: 'Hello World',
        priority: 'high',
        metadata: { source: 'test' },
      };

      const response = await fetch(`${BASE_URL}/worker/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data: WorkerResponse = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('pending');
      expect(data.requestId).toBeDefined();
    });

    it('should handle empty request body', async () => {
      const response = await fetch(`${BASE_URL}/worker/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data: WorkerResponse = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('pending');
      expect(data.requestId).toBeDefined();
    });
  });

  describe('GET /api/worker/status/:requestId', () => {
    it('should return request status', async () => {
      // First submit a request
      const submitResponse = await fetch(`${BASE_URL}/worker/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: 'test request' }),
      });

      const submitData: WorkerResponse = await submitResponse.json();
      const requestId = submitData.requestId;

      // Then check its status
      const statusResponse = await fetch(`${BASE_URL}/worker/status/${requestId}`);
      const statusData = await statusResponse.json();

      expect(statusResponse.status).toBe(200);
      expect(statusData.requestId).toBe(requestId);
      expect(statusData.status).toBeDefined();
      expect(['pending', 'completed']).toContain(statusData.status);
    });

    it('should return 404 for non-existent request', async () => {
      const response = await fetch(`${BASE_URL}/worker/status/non-existent-id`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/worker/requests', () => {
    it('should return all requests', async () => {
      const response = await fetch(`${BASE_URL}/worker/requests`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.requests).toBeDefined();
      expect(Array.isArray(data.requests)).toBe(true);
      expect(data.total).toBeDefined();
      expect(typeof data.total).toBe('number');
      expect(data.pending).toBeDefined();
      expect(typeof data.pending).toBe('number');
      expect(data.completed).toBeDefined();
      expect(typeof data.completed).toBe('number');
    });

    it('should return empty list when no requests', async () => {
      const response = await fetch(`${BASE_URL}/worker/requests`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.requests).toHaveLength(0);
      expect(data.total).toBe(0);
      expect(data.pending).toBe(0);
      expect(data.completed).toBe(0);
    });

    it('should count requests correctly after submission', async () => {
      // Submit a request
      await fetch(`${BASE_URL}/worker/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: 'test request' }),
      });

      // Check the count
      const response = await fetch(`${BASE_URL}/worker/requests`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.total).toBe(1);
      expect(data.pending).toBe(1);
      expect(data.completed).toBe(0);
    });
  });

  describe('DELETE /api/worker/clear', () => {
    it('should clear all requests', async () => {
      // Submit a request first
      await fetch(`${BASE_URL}/worker/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: 'test request' }),
      });

      // Clear all requests
      const response = await fetch(`${BASE_URL}/worker/clear`, {
        method: 'DELETE',
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('All requests cleared');
      expect(data.timestamp).toBeDefined();

      // Verify queue is empty
      const requestsResponse = await fetch(`${BASE_URL}/worker/requests`);
      const requestsData = await requestsResponse.json();

      expect(requestsData.total).toBe(0);
      expect(requestsData.pending).toBe(0);
      expect(requestsData.completed).toBe(0);
    });

    it('should handle clearing empty queue', async () => {
      const response = await fetch(`${BASE_URL}/worker/clear`, {
        method: 'DELETE',
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('All requests cleared');
    });
  });
});
