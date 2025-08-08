// Global test setup
const BASE_URL = 'http://localhost:5001/api';

// Global test utilities
(global as any).BASE_URL = BASE_URL;

// Increase timeout for streaming tests
jest.setTimeout(10000);

// Helper function to wait for server to be ready
export const waitForServer = async (): Promise<void> => {
  const maxAttempts = 10;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      if (response.ok) {
        return;
      }
    } catch (error) {
      // Server not ready yet
    }

    attempts++;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error('Server not ready after 10 seconds');
};
