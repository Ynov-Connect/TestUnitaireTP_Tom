import axios from 'axios';

const port = process.env.REACT_APP_SERVER_PORT;
const API_URL = port
  ? `http://localhost:${port}`
  : (process.env.REACT_APP_API_URL || 'https://jsonplaceholder.typicode.com');

/**
 * Récupère la liste de tous les utilisateurs depuis l'API.
 * @returns {Promise<Array>} La liste des utilisateurs.
 */
export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  // Si la réponse contient une structure de données spécifique, on la transforme en objets utilisateur
  if (response.data && response.data.utilisateurs) {
    return response.data.utilisateurs.map((u) =>
      Array.isArray(u)
        ? { id: u[0], name: u[1], email: u[2], date_creation: u[3] }
        : u
    );
  }
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
