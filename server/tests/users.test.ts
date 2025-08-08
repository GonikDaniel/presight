import fetch from 'node-fetch';
import { waitForServer } from './setup';
import type { UsersResponse, FiltersResponse } from '../src/types';

const BASE_URL = global.BASE_URL || 'http://localhost:5001/api';

describe('Users API', () => {
  beforeAll(async () => {
    await waitForServer();
  });

  describe('GET /api/users', () => {
    it('should return paginated users with default parameters', async () => {
      const response = await fetch(`${BASE_URL}/users`);
      const data: UsersResponse = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.currentPage).toBe(1);
      expect(data.pagination.totalItems).toBeGreaterThan(0);
    });

    it('should return paginated users with custom parameters', async () => {
      const response = await fetch(`${BASE_URL}/users?page=1&limit=5`);
      const data: UsersResponse = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(5);
      expect(data.pagination.currentPage).toBe(1);
      expect(data.pagination.totalItems).toBeGreaterThan(0);
    });

    it('should handle search functionality', async () => {
      const response = await fetch(`${BASE_URL}/users?search=john&limit=3`);
      const data: UsersResponse = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.length).toBeLessThanOrEqual(3);

      // If we have results, check that they contain 'john'
      if (data.data.length > 0) {
        const hasJohn = data.data.some(
          (user) =>
            user.first_name.toLowerCase().includes('john') ||
            user.last_name.toLowerCase().includes('john')
        );
        expect(hasJohn).toBe(true);
      }
    });

    it('should filter by nationality', async () => {
      const response = await fetch(`${BASE_URL}/users?nationality=American&limit=3`);
      const data: UsersResponse = await response.json();

      expect(response.status).toBe(200);

      if (data.data.length > 0) {
        data.data.forEach((user) => {
          expect(user.nationality).toBe('American');
        });
      }
    });

    it('should filter by hobbies', async () => {
      const response = await fetch(`${BASE_URL}/users?hobbies=Reading&limit=3`);
      const data: UsersResponse = await response.json();

      expect(response.status).toBe(200);

      if (data.data.length > 0) {
        data.data.forEach((user) => {
          expect(user.hobbies).toContain('Reading');
        });
      }
    });

    it('should handle multiple hobbies filter', async () => {
      const response = await fetch(`${BASE_URL}/users?hobbies=Reading,Swimming&limit=3`);
      const data: UsersResponse = await response.json();

      expect(response.status).toBe(200);

      if (data.data.length > 0) {
        data.data.forEach((user) => {
          const hasReadingOrSwimming = user.hobbies.some(
            (hobby) => hobby === 'Reading' || hobby === 'Swimming'
          );
          expect(hasReadingOrSwimming).toBe(true);
        });
      }
    });

    it('should handle invalid page parameter', async () => {
      const response = await fetch(`${BASE_URL}/users?page=999&limit=5`);
      const data: UsersResponse = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(0);
      expect(data.pagination.currentPage).toBe(999);
    });
  });

  describe('GET /api/filters', () => {
    it('should return top hobbies and nationalities', async () => {
      const response = await fetch(`${BASE_URL}/filters`);
      const data: FiltersResponse = await response.json();

      expect(response.status).toBe(200);
      expect(data.topHobbies).toBeDefined();
      expect(data.topNationalities).toBeDefined();
      expect(Array.isArray(data.topHobbies)).toBe(true);
      expect(Array.isArray(data.topNationalities)).toBe(true);
      expect(data.topHobbies.length).toBeGreaterThan(0);
      expect(data.topNationalities.length).toBeGreaterThan(0);
    });

    it('should return valid filter data structure', async () => {
      const response = await fetch(`${BASE_URL}/filters`);
      const data: FiltersResponse = await response.json();

      expect(response.status).toBe(200);

      // Check hobbies structure
      data.topHobbies.forEach((hobby) => {
        expect(hobby).toHaveProperty('hobby');
        expect(hobby).toHaveProperty('count');
        expect(typeof hobby.hobby).toBe('string');
        expect(typeof hobby.count).toBe('number');
        expect(hobby.count).toBeGreaterThan(0);
      });

      // Check nationalities structure
      data.topNationalities.forEach((nationality) => {
        expect(nationality).toHaveProperty('nationality');
        expect(nationality).toHaveProperty('count');
        expect(typeof nationality.nationality).toBe('string');
        expect(typeof nationality.count).toBe('number');
        expect(nationality.count).toBeGreaterThan(0);
      });
    });
  });
});
