import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsers, createUser } from './api';

export const UsersContext = createContext({
  users: [],
  addUser: () => {},
  loading: false,
  error: null,
});

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addUser = async (userData) => {
    const newUser = await createUser(userData);
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  return (
    <UsersContext.Provider value={{ users, addUser, loading, error }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
