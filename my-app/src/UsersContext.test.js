import React, { useState } from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UsersProvider, useUsers } from './UsersContext';
import { getUsers, createUser } from './api';

jest.mock('./api', () => ({
  getUsers: jest.fn(),
  createUser: jest.fn(),
}));

const TestConsumer = () => {
  const { users, addUser, loading, error } = useUsers();
  const [callError, setCallError] = useState(null);

  const handleAdd = async () => {
    try {
      await addUser({ firstName: 'Test', lastName: 'User' });
    } catch (e) {
      setCallError(e.message);
    }
  };

  return (
    <div>
      <span data-testid="count">{users.length}</span>
      {loading && <span data-testid="loading">Chargement...</span>}
      {error && <span data-testid="error">{error}</span>}
      {callError && <span data-testid="call-error">{callError}</span>}
      <button onClick={handleAdd}>Ajouter</button>
    </div>
  );
};

describe('UsersContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche le chargement puis la liste des utilisateurs (succès)', async () => {
    getUsers.mockResolvedValueOnce([
      { id: 1, firstName: 'Alice', lastName: 'Dupont' },
    ]);

    render(
      <UsersProvider>
        <TestConsumer />
      </UsersProvider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('1');
    });

    expect(getUsers).toHaveBeenCalledTimes(1);
  });

  test('initialise avec une liste vide si l\'API retourne []', async () => {
    getUsers.mockResolvedValueOnce([]);

    render(
      <UsersProvider>
        <TestConsumer />
      </UsersProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('0');
    });
  });

  test('affiche une erreur si getUsers échoue', async () => {
    getUsers.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <UsersProvider>
        <TestConsumer />
      </UsersProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Network Error');
    });
  });

  test('addUser appelle createUser et ajoute l\'utilisateur dans la liste', async () => {
    getUsers.mockResolvedValueOnce([]);
    createUser.mockResolvedValueOnce({ id: 11, firstName: 'Test', lastName: 'User' });

    render(
      <UsersProvider>
        <TestConsumer />
      </UsersProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('0');
    });

    await act(async () => {
      screen.getByRole('button').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('1');
    });

    expect(createUser).toHaveBeenCalledWith({ firstName: 'Test', lastName: 'User' });
  });

  test('addUser propage l\'erreur si createUser échoue', async () => {
    getUsers.mockResolvedValueOnce([]);
    createUser.mockRejectedValueOnce(new Error('Création échouée'));

    render(
      <UsersProvider>
        <TestConsumer />
      </UsersProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('0');
    });

    await act(async () => {
      screen.getByRole('button').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('call-error')).toHaveTextContent('Création échouée');
    });

    expect(createUser).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('count').textContent).toBe('0');
  });
});
