import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomePage from './HomePage';
import { UsersContext } from './UsersContext';

const renderHomePage = (users = []) =>
  render(
    <UsersContext.Provider value={{ users, addUser: jest.fn() }}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </UsersContext.Provider>
  );

describe('HomePage', () => {
  test('affiche 0 utilisateur et message vide quand aucun inscrit', () => {
    renderHomePage([]);
    expect(screen.getByText(/0 utilisateur\(s\) inscrit\(s\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Aucun utilisateur inscrit/i)).toBeInTheDocument();
  });

  test('affiche le compteur et la liste quand des utilisateurs sont inscrits', () => {
    const users = [
      { firstName: 'Alice', lastName: 'Dupont', email: 'alice@test.com', birthDate: '1995-01-01', postalCode: '75001', city: 'Paris' },
      { firstName: 'Bob', lastName: 'Martin', email: 'bob@test.com', birthDate: '1990-05-10', postalCode: '69001', city: 'Lyon' },
    ];
    renderHomePage(users);

    expect(screen.getByText(/2 utilisateur\(s\) inscrit\(s\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Dupont Alice/i)).toBeInTheDocument();
    expect(screen.getByText(/Martin Bob/i)).toBeInTheDocument();
    expect(screen.queryByText(/Aucun utilisateur inscrit/i)).not.toBeInTheDocument();
  });

  test('affiche un lien vers le formulaire d\'inscription', () => {
    renderHomePage([]);
    expect(screen.getByRole('link', { name: /s'inscrire/i })).toBeInTheDocument();
  });
});
