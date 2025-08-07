import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usersApi } from '../services/api';
import type { QueryParams } from '../types';
import { UserCard } from './UserCard';

interface VirtualizedUsersListProps {
  filters?: QueryParams;
}

const ITEMS_PER_PAGE = 50; // Increased for better virtual scrolling performance

export function VirtualizedUsersList({ filters = {} }: VirtualizedUsersListProps) {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  // Infinite query for fetching users
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery({
      queryKey: ['users', filters],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await usersApi.getUsers({
          ...filters,
          page: pageParam,
          limit: ITEMS_PER_PAGE,
        });
        return response;
      },
      getNextPageParam: (lastPage) => {
        return lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined;
      },
      initialPageParam: 1,
    });

  // Flatten all pages into a single array
  const allUsers = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  // Calculate grid layout
  const ITEMS_PER_ROW = 3; // 3 cards per row on desktop
  const totalRows = Math.ceil(allUsers.length / ITEMS_PER_ROW);
  const hasLoaderRow = hasNextPage;
  const totalVirtualRows = hasLoaderRow ? totalRows + 1 : totalRows;

  // Virtualizer setup for rows
  const rowVirtualizer = useVirtualizer({
    count: totalVirtualRows,
    getScrollElement: () => containerRef,
    estimateSize: () => 200, // Reduced height for tighter spacing
    overscan: 3, // Number of rows to render outside the viewport
  });

  // Load more when reaching the end
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Check if we need to load more
  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    if (!lastItem) return;

    if (lastItem.index >= totalRows - 1 && hasNextPage && !isFetchingNextPage) {
      loadMore();
    }
  }, [rowVirtualizer.getVirtualItems(), totalRows, hasNextPage, isFetchingNextPage, loadMore]);

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: {error.message}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-600 mt-1">
            {isLoading ? 'Loading...' : `${allUsers.length} users found`}
          </p>
        </div>
      </div>

      {/* Virtualized List Container */}
      <div
        ref={setContainerRef}
        className="h-[600px] overflow-auto"
        style={{
          contain: 'strict',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index >= totalRows;

            return (
              <div
                key={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  // Loading indicator at the bottom
                  <div className="flex items-center justify-center py-8">
                    <div className="inline-flex items-center space-x-3 text-gray-600">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="text-lg">Loading more users...</span>
                    </div>
                  </div>
                ) : (
                  // Grid row with up to 3 cards
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: ITEMS_PER_ROW }, (_, colIndex) => {
                      const userIndex = virtualRow.index * ITEMS_PER_ROW + colIndex;
                      const user = allUsers[userIndex];

                      if (!user) return null;

                      return <UserCard key={userIndex} user={user} />;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading State for Initial Load */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center space-x-3 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-lg">Loading users...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && allUsers.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters to find more users.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
