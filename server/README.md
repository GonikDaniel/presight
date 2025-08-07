# Presight Backend Server

## Overview

This is the backend server for the Presight exercise, implementing the paginated user list API with filtering and search capabilities.

## Features Implemented

### 1. Mock Data Generation

- Generates 1000 user records with the following fields:
  - `avatar`: Faker-generated avatar URL
  - `first_name`: Random first name
  - `last_name`: Random last name
  - `age`: Random age (18-99)
  - `nationality`: Random nationality from predefined list
  - `hobbies`: 0-10 random hobbies from predefined list

### 2. API Endpoints

#### `GET /api/health`

Health check endpoint to verify server is running.

#### `GET /api/users`

Paginated user list with filtering and search capabilities.

**Query Parameters:**

- `page` (default: 1): Page number
- `limit` (default: 20): Items per page
- `search`: Search in first_name and last_name
- `nationality`: Filter by nationality
- `hobbies`: Filter by hobbies (comma-separated)

**Response:**

```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 50,
    "totalItems": 1000,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### `GET /api/filters`

Returns top 20 hobbies and nationalities for filtering.

**Response:**

```json
{
  "topHobbies": [
    { "hobby": "Reading", "count": 156 },
    ...
  ],
  "topNationalities": [
    { "nationality": "American", "count": 45 },
    ...
  ]
}
```

## Setup and Running

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Build the project (for production):

   ```bash
   yarn build
   ```

3. Start the server:

   ```bash
   # For production:
   yarn start
   # For development with auto-restart:
   yarn dev
   ```

4. Server will run on `http://localhost:5001`

## Testing

Run the test script to verify all endpoints:

```bash
yarn test
```

## Data Structure

### User Object

```json
{
  "id": 1,
  "avatar": "https://...",
  "first_name": "John",
  "last_name": "Doe",
  "age": 25,
  "nationality": "American",
  "hobbies": ["Reading", "Gaming", "Cooking"]
}
```

## Project Structure

```
src/
├── types/
│   └── index.ts          # TypeScript type definitions
├── utils/
│   └── mockData.ts       # Mock data generation utilities
├── index.ts              # Main server file
└── index.test.ts         # API test file
```

## Next Steps

- Frontend integration
- Virtual scrolling implementation
- Advanced filtering UI
