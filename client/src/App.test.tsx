import { render } from '@testing-library/react';
import { screen, waitForElementToBeRemoved } from '@testing-library/dom';
import App from './App';

jest.mock('./services/api', () => ({
  usersApi: {
    getFilters: jest.fn().mockResolvedValue({ topHobbies: [], topNationalities: [] }),
  },
}));

test('renders app header and sections', async () => {
  render(<App />);

  // Wait for Suspense fallback in default view to resolve
  const loading = screen.getByText(/Loading users…/i);
  await waitForElementToBeRemoved(loading);

  expect(screen.getByRole('heading', { name: /Presight User Directory/i })).toBeInTheDocument();

  // Filters panel title
  expect(screen.getByText(/Filters/i)).toBeInTheDocument();

  // View mode selector radios
  expect(screen.getByRole('radio', { name: /User Cards/i })).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: /Text Streaming/i })).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: /Worker Requests/i })).toBeInTheDocument();
});
