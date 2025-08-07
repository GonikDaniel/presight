import { useState, useEffect } from 'react';
import { UsersList } from './components/UsersList.js';
import { SimpleSelect } from './components/SimpleSelect.js';
import { usersApi } from './services/api.js';
import type { QueryParams, FilterItem } from './types/index.js';

function App() {
  const [filters, setFilters] = useState<QueryParams>({});
  const [availableFilters, setAvailableFilters] = useState<{
    topHobbies: FilterItem[];
    topNationalities: FilterItem[];
  }>({ topHobbies: [], topNationalities: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const response = await usersApi.getFilters();
        setAvailableFilters(response);
      } catch (error) {
        console.error('Failed to load filters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilters();
  }, []);

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search: search || undefined }));
  };

  const handleNationalityFilter = (nationality: string) => {
    setFilters((prev) => ({
      ...prev,
      nationality: nationality === 'all' ? undefined : nationality,
    }));
  };

  const handleHobbyFilter = (hobby: string) => {
    setFilters((prev) => ({
      ...prev,
      hobbies: hobby === 'all' ? undefined : hobby,
    }));
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                {(filters.search || filters.nationality || filters.hobbies) && (
                  <button
                    onClick={() => setFilters({})}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search by Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name to search..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>

                {/* Nationality Filter */}
                <div>
                  <SimpleSelect
                    options={[
                      { value: 'all', label: 'All Nationalities' },
                      ...availableFilters.topNationalities.map((item) => ({
                        value: item.nationality!,
                        label: item.nationality!,
                        count: item.count,
                      })),
                    ]}
                    value={filters.nationality || 'all'}
                    onChange={handleNationalityFilter}
                    placeholder="Select nationality"
                    label="Nationality"
                  />
                </div>

                {/* Hobbies Filter */}
                <div>
                  <SimpleSelect
                    options={[
                      { value: 'all', label: 'All Hobbies' },
                      ...availableFilters.topHobbies.map((item) => ({
                        value: item.hobby!,
                        label: item.hobby!,
                        count: item.count,
                      })),
                    ]}
                    value={filters.hobbies || 'all'}
                    onChange={handleHobbyFilter}
                    placeholder="Select hobby"
                    label="Top Hobbies"
                  />
                </div>
              </div>

              {/* Active Filters Summary */}
              {(filters.search || filters.nationality || filters.hobbies) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h3>
                  <div className="space-y-2">
                    {filters.search && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Search:</span>
                        <span className="font-medium text-gray-900">"{filters.search}"</span>
                      </div>
                    )}
                    {filters.nationality && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Nationality:</span>
                        <span className="font-medium text-gray-900">{filters.nationality}</span>
                      </div>
                    )}
                    {filters.hobbies && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Hobby:</span>
                        <span className="font-medium text-gray-900">{filters.hobbies}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center space-x-2 text-gray-600">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span className="text-lg">Loading filters...</span>
                </div>
              </div>
            ) : (
              <UsersList filters={filters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
