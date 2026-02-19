import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home page with user count', () => {
  render(<App />);
  const userCount = screen.getByText(/utilisateur\(s\) inscrit\(s\)/i);
  expect(userCount).toBeInTheDocument();
});
