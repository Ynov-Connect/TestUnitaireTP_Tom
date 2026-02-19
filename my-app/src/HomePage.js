import React from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from './UsersContext';
import './HomePage.css';

const HomePage = () => {
  const { users } = useUsers();

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
              {user.lastName} {user.firstName}
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
