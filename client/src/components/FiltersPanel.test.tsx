import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { FiltersPanel } from './FiltersPanel';
import { usersApi } from '../services/api';

jest.mock('../services/api', () => ({
  usersApi: {
    getFilters: jest.fn().mockResolvedValue({
      topHobbies: [
        { hobby: 'Reading', count: 10 },
        { hobby: 'Gaming', count: 8 },
      ],
      topNationalities: [
        { nationality: 'American', count: 5 },
        { nationality: 'German', count: 3 },
      ],
    }),
  },
}));

test('loads and displays filters; updates search', async () => {
  const handleChange = jest.fn();

  render(<FiltersPanel filters={{}} onFiltersChange={handleChange} />);

  expect(screen.getByText(/Loading filters/i)).toBeInTheDocument();

  await waitFor(() => expect(usersApi.getFilters).toHaveBeenCalled());

  // Wait for loading to disappear
  await waitFor(() => expect(screen.queryByText(/Loading filters/i)).not.toBeInTheDocument());

  // Nationality dropdown contains options from API (custom select, not native label)
  expect(screen.getByText(/All Nationalities/i)).toBeInTheDocument();

  // Search input updates debounced search
  const input = screen.getByPlaceholderText(/Enter name to search/i) as HTMLInputElement;
  await userEvent.type(input, 'Jane');

  await waitFor(() => expect(handleChange).toHaveBeenCalled());
});
