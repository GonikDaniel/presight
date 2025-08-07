class TextStreamingApi {
  private baseUrl = 'http://localhost:5001';

  // Stream text character by character
  async streamText(
    speed: number = 50,
    onCharacter: (char: string) => void,
    onComplete: (fullText: string) => void,
    onError?: (error: Error) => void
  ): Promise<() => void> {
    const url =
      speed === 50 ? `${this.baseUrl}/api/stream-text` : `${this.baseUrl}/api/stream-text/${speed}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let fullText = '';

      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              onComplete(fullText);
              break;
            }

            const chunk = decoder.decode(value, { stream: true });

            // Process each character in the chunk
            for (const char of chunk) {
              fullText += char;
              onCharacter(char);
            }
          }
        } catch (error) {
          console.error('Text streaming error:', error);
          onError?.(error as Error);
        }
      };

      processStream();

      // Return cleanup function
      return () => {
        reader.cancel();
      };
    } catch (error) {
      console.error('Failed to start text streaming:', error);
      onError?.(error as Error);
      return () => {};
    }
  }

  // Alternative method using EventSource (if needed)
  async streamTextWithEventSource(
    onCharacter: (char: string) => void,
    onComplete: (fullText: string) => void,
    onError?: (error: Event) => void
  ): Promise<() => void> {
    const url = `${this.baseUrl}/api/stream-text`;

    const eventSource = new EventSource(url);
    let fullText = '';

    eventSource.onmessage = (event) => {
      const char = event.data;
      fullText += char;
      onCharacter(char);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
      onError?.(error);
    };

    eventSource.onclose = () => {
      onComplete(fullText);
    };

    // Return cleanup function
    return () => {
      eventSource.close();
    };
  }
}

export const textStreamingApi = new TextStreamingApi();
