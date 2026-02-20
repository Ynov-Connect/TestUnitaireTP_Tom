import { render, screen } from '@testing-library/react';
import App from './App';
import { getUsers } from './api';

jest.mock('./api');

beforeEach(() => {
  getUsers.mockResolvedValue([]);
});

test('renders the home page with user count', async () => {
  render(<App />);
  const userCount = await screen.findByText(/utilisateur\(s\) inscrit\(s\)/i);
  expect(userCount).toBeInTheDocument();
});

test('affiche le lien vers le formulaire', async () => {
  render(<App />);
  const link = await screen.findByText(/s'inscrire/i);
  expect(link).toBeInTheDocument();
});
