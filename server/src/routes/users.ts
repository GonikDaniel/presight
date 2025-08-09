import { Router } from 'express';
import { generateMockData, getTopHobbiesAndNationalities } from '../utils/mockData';
import type { QueryParams, UsersResponse, FiltersResponse } from '../types';

const router = Router();

// Generate mock data on server start (1000 records)
let mockData = generateMockData(1000);

// Users endpoint with pagination and filtering
router.get('/api/users', (req, res) => {
  try {
    const {
      page = '1',
      limit = '20',
      search = '',
      nationality = '',
      hobbies = '',
    }: QueryParams = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let filteredData = [...mockData];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchLower) ||
          user.last_name.toLowerCase().includes(searchLower)
      );
    }

    // Apply nationality filter
    if (nationality) {
      filteredData = filteredData.filter(
        (user) => user.nationality.toLowerCase() === nationality.toLowerCase()
      );
    }

    // Apply hobbies filter
    if (hobbies) {
      const hobbyArray = hobbies.split(',').map((h) => h.trim().toLowerCase());
      filteredData = filteredData.filter((user) =>
        user.hobbies.some((hobby) => hobbyArray.includes(hobby.toLowerCase()))
      );
    }

    // Calculate pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredData.length / limitNum);

    const response: UsersResponse = {
      data: paginatedData,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: filteredData.length,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Filters endpoint
router.get('/api/filters', (_req, res) => {
  try {
    const { topHobbies, topNationalities } = getTopHobbiesAndNationalities(mockData);
    const response: FiltersResponse = {
      topHobbies,
      topNationalities,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
router.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
