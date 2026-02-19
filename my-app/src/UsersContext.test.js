import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UsersProvider, useUsers } from './UsersContext';

const TestConsumer = () => {
  const { users, addUser } = useUsers();
  return (
    <div>
      <span data-testid="count">{users.length}</span>
      <button onClick={() => addUser({ firstName: 'Test', lastName: 'User' })}>Add</button>
    </div>
  );
};

describe('UsersContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('initialise avec un tableau vide si localStorage est vide', () => {
    render(
      <UsersProvider>
        <TestConsumer />
      </UsersProvider>
    );
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  test('initialise depuis localStorage si des données existent', () => {
    localStorage.setItem(
      'users',
      JSON.stringify([{ firstName: 'Alice', lastName: 'Dupont' }])
    );
    render(
      <UsersProvider>
        <TestConsumer />
      </UsersProvider>
    );
    expect(screen.getByTestId('count').textContent).toBe('1');
  });

  test('retourne un tableau vide si localStorage contient du JSON invalide', () => {
    localStorage.setItem('users', 'invalid-json');
    render(
      <UsersProvider>
        <TestConsumer />
      </UsersProvider>
    );
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  test('addUser ajoute un utilisateur et persiste dans localStorage', () => {
    render(
      <UsersProvider>
        <TestConsumer />
      </UsersProvider>
    );

    act(() => {
      screen.getByRole('button').click();
    });

    expect(screen.getByTestId('count').textContent).toBe('1');
    const stored = JSON.parse(localStorage.getItem('users'));
    expect(stored).toHaveLength(1);
    expect(stored[0].firstName).toBe('Test');
  });
});
