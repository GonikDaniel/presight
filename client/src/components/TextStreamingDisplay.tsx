import { useState, useEffect, useCallback, useRef } from 'react';
import { textStreamingApi } from '../services/textStreamingApi';

interface TextStreamingDisplayProps {
  speed?: number;
}

export function TextStreamingDisplay({ speed = 50 }: TextStreamingDisplayProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [fullText, setFullText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState(0);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const stopStreaming = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const resetState = useCallback(() => {
    setDisplayedText('');
    setFullText('');
    setIsStreaming(false);
    setIsComplete(false);
    setError(null);
    setCharacterCount(0);
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
  }, []);

  const startStreaming = useCallback(async () => {
    resetState();
    setIsStreaming(true);
    setError(null);

    try {
      const cleanup = await textStreamingApi.streamText(
        speed,
        (char: string) => {
          setDisplayedText((prev) => prev + char);
          setCharacterCount((prev) => prev + 1);
        },
        (completeText: string) => {
          setFullText(completeText);
          setIsComplete(true);
          setIsStreaming(false);
          cleanupRef.current = null;
        },
        (error: Error) => {
          setError(error.message);
          setIsStreaming(false);
          cleanupRef.current = null;
        }
      );

      // Store cleanup function
      cleanupRef.current = cleanup;
    } catch (error) {
      setError('Failed to start streaming');
      setIsStreaming(false);
    }
  }, [speed, resetState]);

  // Auto-scroll to bottom as new characters arrive
  useEffect(() => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollTop = textContainerRef.current.scrollHeight;
    }
  }, [displayedText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Text Streaming Demo</h2>
          <p className="text-gray-600 mt-1">
            {isStreaming
              ? 'Streaming text character by character...'
              : isComplete
                ? 'Streaming complete!'
                : 'Ready to stream'}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Character Counter */}
          <div className="text-sm text-gray-600">Characters: {characterCount}</div>

          {/* Speed Indicator */}
          <div className="text-sm text-gray-600">Speed: {speed}ms/char</div>

          {/* Status Indicator */}
          {isStreaming && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Streaming...</span>
            </div>
          )}

          {isComplete && (
            <div className="flex items-center space-x-2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={startStreaming}
          disabled={isStreaming}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isStreaming
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isStreaming ? 'Streaming...' : 'Start Streaming'}
        </button>

        {isStreaming && (
          <button
            onClick={stopStreaming}
            className="px-4 py-3 rounded-lg font-medium transition-colors bg-red-500 text-white hover:bg-red-600"
          >
            Stop
          </button>
        )}

        <button
          onClick={resetState}
          disabled={isStreaming}
          className={`px-4 py-3 rounded-lg font-medium transition-colors ${
            isStreaming
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
        >
          Reset
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
            <span className="text-red-700 font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      {/* Text Display */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {isComplete ? 'Complete Text' : 'Streaming Text'}
          </h3>
        </div>

        <div
          ref={textContainerRef}
          className="h-96 overflow-y-auto p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          }}
        >
          {displayedText || (
            <span className="text-gray-400 italic">
              Click "Start Streaming" to begin receiving text character by character...
            </span>
          )}

          {/* Cursor indicator when streaming */}
          {isStreaming && (
            <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1"></span>
          )}
        </div>
      </div>

      {/* Full Text Display (when complete) */}
      {isComplete && fullText && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-green-50 px-6 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-green-900">Complete Response</h3>
          </div>

          <div className="h-64 overflow-y-auto p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap bg-gray-50">
            {fullText}
          </div>
        </div>
      )}
    </div>
  );
}
