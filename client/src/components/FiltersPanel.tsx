import { useState, useEffect } from 'react';
import { SimpleSelect } from './SimpleSelect';
import { usersApi } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import type { QueryParams, FilterItem } from '../types/index';

interface FiltersPanelProps {
  filters: QueryParams;
  onFiltersChange: (filters: QueryParams) => void;
}

export function FiltersPanel({ filters, onFiltersChange }: FiltersPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableFilters, setAvailableFilters] = useState<{
    topHobbies: FilterItem[];
    topNationalities: FilterItem[];
  }>({ topHobbies: [], topNationalities: [] });
  const [loading, setLoading] = useState(true);

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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

  // Update filters when debounced search term changes
  useEffect(() => {
    onFiltersChange({ ...filters, search: debouncedSearchTerm || undefined });
  }, [debouncedSearchTerm]);

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  const handleNationalityFilter = (nationality: string) => {
    onFiltersChange({
      ...filters,
      nationality: nationality === 'all' ? undefined : nationality,
    });
  };

  const handleHobbyFilter = (hobby: string) => {
    onFiltersChange({
      ...filters,
      hobbies: hobby === 'all' ? undefined : hobby,
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    onFiltersChange({});
  };

  if (loading) {
    return (
      <div className="xl:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-lg">Loading filters...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="xl:col-span-1">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
          {(filters.search || filters.nationality || filters.hobbies) && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search by Name</label>
            <input
              type="text"
              placeholder="Enter name to search..."
              value={searchTerm}
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
  );
}
