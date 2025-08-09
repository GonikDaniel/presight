import { Router } from 'express';
import { faker } from '@faker-js/faker';

const router = Router();
const DEFAULT_SIMULATED_STREAMING_DELAY = 50;

// Streaming endpoint for long text content
router.get('/api/stream-text', async (_req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  try {
    const longText = faker.lorem.paragraphs(32);

    // Stream the text character by character
    for (let i = 0; i < longText.length; i++) {
      const char = longText[i];

      // Send the character
      res.write(char);

      // Add a small delay to simulate streaming
      await new Promise((resolve) => setTimeout(resolve, DEFAULT_SIMULATED_STREAMING_DELAY));

      // Check if client disconnected
      if (res.destroyed) {
        return;
      }
    }

    // End the stream
    res.end();
  } catch (error) {
    console.error('Text streaming error:', error);
    res.write('Error: Failed to stream text content');
    res.end();
  }
});

// Alternative endpoint with configurable speed
router.get('/api/stream-text/:speed', async (req, res) => {
  const speed = parseInt(req.params.speed) || DEFAULT_SIMULATED_STREAMING_DELAY;

  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  try {
    const longText = faker.lorem.paragraphs(32);

    for (let i = 0; i < longText.length; i++) {
      const char = longText[i];
      res.write(char);

      await new Promise((resolve) => setTimeout(resolve, speed));

      if (res.destroyed) {
        return;
      }
    }

    res.end();
  } catch (error) {
    console.error('Text streaming error:', error);
    res.write('Error: Failed to stream text content');
    res.end();
  }
});

export default router;
