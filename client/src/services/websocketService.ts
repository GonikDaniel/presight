import { io, Socket } from 'socket.io-client';
import type { WebSocketMessage } from '../types';

class WebSocketService {
  private socket: Socket | null = null;
  private baseUrl = 'http://localhost:5001';

  // Connect to WebSocket
  connect(): Socket {
    if (!this.socket) {
      this.socket = io(this.baseUrl);

      this.socket.on('connect', () => {
        console.log('WebSocket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
      });
    }

    return this.socket;
  }

  // Listen for request completion
  onRequestCompleted(callback: (message: WebSocketMessage) => void): void {
    if (this.socket) {
      this.socket.on('request-completed', callback);
    }
  }

  // Listen for request errors
  onRequestError(callback: (message: WebSocketMessage) => void): void {
    if (this.socket) {
      this.socket.on('request-error', callback);
    }
  }

  // Disconnect WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket;
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const websocketService = new WebSocketService();
