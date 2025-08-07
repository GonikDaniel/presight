import axios from 'axios';
import type { UsersResponse, FiltersResponse, QueryParams } from '../types/index.js';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const usersApi = {
  getUsers: async (params: QueryParams = {}): Promise<UsersResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.nationality) searchParams.append('nationality', params.nationality);
    if (params.hobbies) searchParams.append('hobbies', params.hobbies);

    const response = await api.get(`/users?${searchParams.toString()}`);
    return response.data;
  },

  getFilters: async (): Promise<FiltersResponse> => {
    const response = await api.get('/filters');
    return response.data;
  },

  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};
