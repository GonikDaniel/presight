import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FiltersPanel } from './components/FiltersPanel';
import { ViewModeSelector } from './components/ViewModeSelector';
import { UserCardsView } from './components/UserCardsView';
import { TextStreamView } from './components/TextStreamView';
import type { QueryParams } from './types';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

function App() {
  const [filters, setFilters] = useState<QueryParams>({});
  const [viewMode, setViewMode] = useState<'virtual' | 'text-streaming'>('virtual');

  const handleFiltersChange = (newFilters: QueryParams) => {
    setFilters(newFilters);
  };

  const handleViewModeChange = (mode: 'virtual' | 'text-streaming') => {
    setViewMode(mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <header className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Presight User Directory</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover and connect with users from around the world. Filter by nationality,
                hobbies, and more.
              </p>
            </header>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <FiltersPanel filters={filters} onFiltersChange={handleFiltersChange} />

          <div className="xl:col-span-3">
            <ViewModeSelector viewMode={viewMode} onViewModeChange={handleViewModeChange} />

            {viewMode === 'virtual' ? (
              <UserCardsView filters={filters} />
            ) : (
              <TextStreamView speed={50} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

export default AppWrapper;
