import { useState, useEffect, useCallback } from 'react';
import { workerApi } from '../services/workerApi';
import { websocketService } from '../services/websocketService';
import type { QueuedRequest, WebSocketMessage } from '../types/index';

interface WorkerRequestsViewProps {
  requestCount?: number;
}

export default function WorkerRequestsView({ requestCount = 20 }: WorkerRequestsViewProps) {
  const [requests, setRequests] = useState<QueuedRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize WebSocket connection
  useEffect(() => {
    const socket = websocketService.connect();
    setIsConnected(socket.connected);

    // Listen for connection status changes
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // Listen for request completion
    websocketService.onRequestCompleted((message: WebSocketMessage) => {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === message.requestId
            ? { ...req, status: 'completed', result: message.result }
            : req
        )
      );
    });

    // Listen for request errors
    websocketService.onRequestError((message: WebSocketMessage) => {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === message.requestId
            ? { ...req, status: 'completed', result: `Error: ${message.error}` }
            : req
        )
      );
    });

    return () => {
      websocketService.disconnect();
    };
  }, []);

  // Submit multiple requests
  const submitRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newRequests: QueuedRequest[] = [];

      // Submit requests in parallel
      const promises = Array.from({ length: requestCount }, async (_, index) => {
        try {
          const response = await workerApi.submitRequest();
          const request: QueuedRequest = {
            id: response.requestId,
            status: 'pending',
            timestamp: response.timestamp,
          };
          newRequests.push(request);
          return request;
        } catch (error) {
          console.error(`Failed to submit request ${index + 1}:`, error);
          throw error;
        }
      });

      await Promise.all(promises);
      setRequests(newRequests);
    } catch (error) {
      console.error('Failed to submit requests:', error);
      setError('Failed to submit requests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [requestCount]);

  const clearRequests = useCallback(async () => {
    try {
      await workerApi.clearAllRequests();
      setRequests([]);
      setError(null);
    } catch (error) {
      console.error('Failed to clear requests:', error);
      setError('Failed to clear requests.');
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const completedCount = requests.filter((r) => r.status === 'completed').length;
  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Worker Requests</h2>
          <p className="text-gray-600 mt-1">
            {requests.length > 0
              ? `${completedCount} completed, ${pendingCount} pending`
              : 'Submit requests to see real-time processing'}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            ></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={submitRequests}
          disabled={isLoading}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Submitting...' : `Submit ${requestCount} Requests`}
        </button>

        <button
          onClick={clearRequests}
          disabled={requests.length === 0}
          className={`px-4 py-3 rounded-lg font-medium transition-colors ${
            requests.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          Clear All
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Requests Grid */}
      {requests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Request Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {request.id.split('_')[2]}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}
                  >
                    {request.status}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(request.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {/* Request Result */}
              {request.status === 'completed' && request.result && (
                <div className="mt-3">
                  <div className="text-xs font-medium text-gray-700 mb-1">Result:</div>
                  <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 max-h-24 overflow-y-auto">
                    {request.result}
                  </div>
                </div>
              )}

              {/* Pending State */}
              {request.status === 'pending' && (
                <div className="mt-3">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-sm text-gray-600">Processing...</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {requests.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Requests</h3>
            <p className="text-gray-500">
              Click "Submit {requestCount} Requests" to start the worker processing demo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
