import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import { UsersList } from './UsersList';
import { usersApi } from '../services/api';

jest.mock('../services/api', () => ({
  usersApi: {
    getUsers: jest.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          avatar: 'a',
          first_name: 'Alice',
          last_name: 'Smith',
          age: 28,
          nationality: 'British',
          hobbies: ['Reading'],
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }),
  },
}));

test('renders users fetched from API', async () => {
  render(<UsersList />);

  await waitFor(() => expect(usersApi.getUsers).toHaveBeenCalled());

  expect(screen.getAllByText(/Users/i)[0]).toBeInTheDocument();
  expect(await screen.findByText(/Alice Smith/i)).toBeInTheDocument();
});
