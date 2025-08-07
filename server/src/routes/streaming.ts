import { Router } from 'express';
import { faker } from '@faker-js/faker';

const router = Router();

// Streaming endpoint for long text content
router.get('/api/stream-text', async (req, res) => {
  // Set headers for streaming
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  try {
    // Generate long text content (32 paragraphs)
    const longText = faker.lorem.paragraphs(32);

    // Stream the text character by character
    for (let i = 0; i < longText.length; i++) {
      const char = longText[i];

      // Send the character
      res.write(char);

      // Add a small delay to simulate streaming (50ms per character)
      await new Promise((resolve) => setTimeout(resolve, 50));

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
  const speed = parseInt(req.params.speed) || 50; // Default 50ms per character

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
