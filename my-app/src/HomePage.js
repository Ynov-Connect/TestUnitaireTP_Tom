import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const userCount = localStorage.getItem('userData') ? 1 : 0;

  return (
    <div className="home-container">
      <h1>Bienvenue</h1>
      <p data-cy="user-count">{userCount} user(s) already registered</p>
      <Link to="/register" data-cy="go-to-form" className="register-link">
        S'inscrire
      </Link>
    </div>
  );
};

export default HomePage;
