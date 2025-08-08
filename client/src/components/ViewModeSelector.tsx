import type { ViewMode } from '../types/index';

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewModeSelector({ viewMode, onViewModeChange }: ViewModeSelectorProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="viewMode"
            value="user-cards"
            checked={viewMode === 'user-cards'}
            onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">User Cards</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="viewMode"
            value="text-streaming"
            checked={viewMode === 'text-streaming'}
            onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Text Streaming</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="viewMode"
            value="worker-requests"
            checked={viewMode === 'worker-requests'}
            onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Worker Requests</span>
        </label>
      </div>
    </div>
  );
}
