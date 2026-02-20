import React from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from './UsersContext';
import './HomePage.css';

const getUserDisplayName = (user) => {
  if (user.lastName || user.firstName) {
    return `${user.lastName || ''} ${user.firstName || ''}`.trim();
  }
  return user.name || user.username || user.email || 'Utilisateur';
};

const HomePage = () => {
  const { users, loading, error } = useUsers();

  if (loading) {
    return (
      <div className="home-container">
        <p data-cy="loading">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <p data-cy="error" className="error-message">Erreur : {error}</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1>Bienvenue</h1>

      <p data-cy="user-count">
        {users.length} utilisateur(s) inscrit(s)
      </p>

      {users.length > 0 ? (
        <ul className="users-list" data-cy="users-list">
          {users.map((user, index) => (
            <li key={index} data-cy="user-item" className="user-item">
              {getUserDisplayName(user)}
            </li>
          ))}
        </ul>
      ) : (
        <p data-cy="empty-list" className="empty-list">
          Aucun utilisateur inscrit
        </p>
      )}

      <Link to="/register" data-cy="go-to-form" className="register-link">
        S'inscrire
      </Link>
    </div>
  );
};

export default HomePage;
