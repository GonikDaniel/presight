import type { QueuedRequest, WorkerResponse } from '../types/index.js';

class WorkerApi {
  private baseUrl = 'http://localhost:5001';

  // Submit a new request
  async submitRequest(): Promise<WorkerResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/worker/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to submit request:', error);
      throw error;
    }
  }

  // Get request status
  async getRequestStatus(requestId: string): Promise<QueuedRequest> {
    try {
      const response = await fetch(`${this.baseUrl}/api/worker/status/${requestId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get request status:', error);
      throw error;
    }
  }

  // Get all requests
  async getAllRequests(): Promise<{
    requests: QueuedRequest[];
    total: number;
    pending: number;
    completed: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/worker/requests`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get all requests:', error);
      throw error;
    }
  }

  // Clear all requests
  async clearAllRequests(): Promise<{ message: string; timestamp: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/worker/clear`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to clear requests:', error);
      throw error;
    }
  }
}

export const workerApi = new WorkerApi();
