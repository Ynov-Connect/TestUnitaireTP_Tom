import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the user form', () => {
  render(<App />);
  const heading = screen.getByText(/formulaire d'inscription/i);
  expect(heading).toBeInTheDocument();
});
