import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the fitness nutrition dashboard', () => {
  render(<App />);

  expect(screen.getByText(/fitness nutrition dashboard/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /shape your intake around the training day/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /show bottle status/i })).toBeInTheDocument();
});
