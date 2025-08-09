import { render, screen } from '@testing-library/react';
import { UserCard } from './UserCard';

const makeUser = (overrides: Partial<any> = {}) => ({
  id: 1,
  avatar: 'https://example.com/avatar.png',
  first_name: 'John',
  last_name: 'Doe',
  age: 30,
  nationality: 'American',
  hobbies: ['Reading', 'Gaming', 'Cooking'],
  ...overrides,
});

test('renders name, meta and hobby badges', () => {
  const user = makeUser();
  render(<UserCard user={user} />);

  expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  expect(screen.getByText(/American • 30 years old/)).toBeInTheDocument();
  expect(screen.getByText('Reading')).toBeInTheDocument();
  expect(screen.getByText('Gaming')).toBeInTheDocument();
  expect(screen.getByText('+1 more')).toBeInTheDocument();
});
