# Presight Frontend Client

## Overview

This is the React frontend for the Presight exercise, implementing a user directory with filtering and search capabilities.

## Features Implemented

### 1. User Card Component

- Displays user information in the specified card format:
  ```
  |----------------------------------|
  | avatar      first_name+last_name |
  |             nationality      age |
  |                                  |
  |             (2 hobbies) (+n)     |
  |----------------------------------|
  ```
- Shows top 2 hobbies with remaining count indicator
- Responsive design with hover effects

### 2. User List with Pagination

- Displays users in a responsive grid layout
- Implements "Load More" pagination (before virtual scrolling)
- Loading states and error handling
- Automatic data refresh when filters change

### 3. Search and Filtering

- Search by first_name and last_name
- Filter by nationality (top 20 nationalities)
- Filter by hobbies (top 20 hobbies)
- Clear all filters functionality
- Real-time filter updates

### 4. API Integration

- TypeScript interfaces matching backend API
- Axios-based API service
- Error handling and loading states
- Proper TypeScript typing throughout

## Project Structure

```
src/
├── components/
│   ├── UserCard.tsx       # Individual user card component
│   └── UsersList.tsx      # User list with pagination
├── services/
│   └── api.ts            # API service layer
├── types/
│   └── index.ts          # TypeScript type definitions
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
└── index.css             # Global styles with Tailwind
```

## Setup and Running

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Start the development server:

   ```bash
   yarn dev
   ```

3. The application will run on `http://localhost:3000`

## Build for Production

```bash
yarn build
```

## Technologies Used

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Axios** for API communication
- **ES Modules** throughout

## API Integration

The frontend communicates with the backend API running on `http://localhost:5001`:

- `GET /api/users` - Fetch paginated user list with filters
- `GET /api/filters` - Get top hobbies and nationalities
- `GET /api/health` - Health check endpoint

## Next Steps

- Implement virtual scrolling with @tanstack/react-virtual
- Add advanced filtering UI
- Implement streaming response display
- Add WebSocket integration for real-time updates
