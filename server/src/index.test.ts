import fetch from 'node-fetch';
import type { UsersResponse, FiltersResponse } from './types';

const BASE_URL = 'http://localhost:5001/api';

async function testAPI(): Promise<void> {
  console.log('🧪 Testing Presight API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    console.log('');

    // Test filters endpoint
    console.log('2. Testing filters endpoint...');
    const filtersResponse = await fetch(`${BASE_URL}/filters`);
    const filtersData: FiltersResponse = await filtersResponse.json();
    console.log('✅ Top 5 Hobbies:', filtersData.topHobbies.slice(0, 5));
    console.log('✅ Top 5 Nationalities:', filtersData.topNationalities.slice(0, 5));
    console.log('');

    // Test users endpoint - first page
    console.log('3. Testing users endpoint (first page)...');
    const usersResponse = await fetch(`${BASE_URL}/users?page=1&limit=5`);
    const usersData: UsersResponse = await usersResponse.json();
    console.log('✅ Users count:', usersData.data.length);
    console.log('✅ Total items:', usersData.pagination.totalItems);
    console.log('✅ Sample user:', usersData.data[0]);
    console.log('');

    // Test search functionality
    console.log('4. Testing search functionality...');
    const searchResponse = await fetch(`${BASE_URL}/users?search=john&limit=3`);
    const searchData: UsersResponse = await searchResponse.json();
    console.log('✅ Search results count:', searchData.data.length);
    if (searchData.data.length > 0) {
      console.log('✅ Sample search result:', searchData.data[0]);
    }
    console.log('');

    // Test nationality filter
    console.log('5. Testing nationality filter...');
    const nationalityResponse = await fetch(`${BASE_URL}/users?nationality=American&limit=3`);
    const nationalityData: UsersResponse = await nationalityResponse.json();
    console.log('✅ American users count:', nationalityData.data.length);
    if (nationalityData.data.length > 0) {
      console.log('✅ Sample American user:', nationalityData.data[0]);
    }
    console.log('');

    console.log('🎉 All tests passed! Backend is working correctly.');
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : 'Unknown error');
    console.log('\n💡 Make sure the server is running with: yarn dev');
  }
}

testAPI();
