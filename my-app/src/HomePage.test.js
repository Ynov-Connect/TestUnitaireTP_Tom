import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomePage from './HomePage';
import { UsersContext } from './UsersContext';

const renderHomePage = (contextValue = {}) => {
  const defaultContext = {
    users: [],
    addUser: jest.fn(),
    loading: false,
    error: null,
    ...contextValue,
  };
  return render(
    <UsersContext.Provider value={defaultContext}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </UsersContext.Provider>
  );
};

describe('HomePage', () => {
  test('affiche 0 utilisateur et message vide quand aucun inscrit', () => {
    renderHomePage();
    expect(screen.getByText(/0 utilisateur\(s\) inscrit\(s\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Aucun utilisateur inscrit/i)).toBeInTheDocument();
  });

  test('affiche le compteur et la liste quand des utilisateurs sont inscrits', () => {
    const users = [
      { id: 1, firstName: 'Alice', lastName: 'Dupont', email: 'alice@test.com' },
      { id: 2, firstName: 'Bob', lastName: 'Martin', email: 'bob@test.com' },
    ];
    renderHomePage({ users });

    expect(screen.getByText(/2 utilisateur\(s\) inscrit\(s\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Dupont Alice/i)).toBeInTheDocument();
    expect(screen.getByText(/Martin Bob/i)).toBeInTheDocument();
    expect(screen.queryByText(/Aucun utilisateur inscrit/i)).not.toBeInTheDocument();
  });

  test('affiche le message de chargement quand loading=true', () => {
    renderHomePage({ loading: true });
    expect(screen.getByText(/Chargement.../i)).toBeInTheDocument();
  });

  test('affiche le message d\'erreur en cas d\'erreur', () => {
    renderHomePage({ error: 'Network Error' });
    expect(screen.getByText(/Erreur/i)).toBeInTheDocument();
    expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
  });

  test('affiche un utilisateur avec le format name (JSONPlaceholder)', () => {
    const users = [{ id: 1, name: 'Leanne Graham', email: 'leanne@april.biz' }];
    renderHomePage({ users });

    expect(screen.getByText(/Leanne Graham/i)).toBeInTheDocument();
  });

  test('affiche un lien vers le formulaire d\'inscription', () => {
    renderHomePage();
    expect(screen.getByRole('link', { name: /s'inscrire/i })).toBeInTheDocument();
  });
});
