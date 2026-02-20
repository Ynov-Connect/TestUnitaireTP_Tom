import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://jsonplaceholder.typicode.com';

/**
 * Récupère la liste de tous les utilisateurs depuis l'API.
 * @returns {Promise<Array>} La liste des utilisateurs.
 */
export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

/**
 * Crée un nouvel utilisateur via l'API.
 * @param {Object} userData - Les données de l'utilisateur à créer.
 * @returns {Promise<Object>} L'utilisateur créé (avec son id).
 */
export const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};
