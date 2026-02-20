import axios from 'axios';
import { getUsers, createUser } from './api';

jest.mock('axios');

describe("API - Tests d'intégration avec axios mocké", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    test('retourne la liste des utilisateurs en cas de succès', async () => {
      const mockUsers = [
        { id: 1, firstName: 'Alice', lastName: 'Dupont', email: 'alice@test.com' },
        { id: 2, firstName: 'Bob', lastName: 'Martin', email: 'bob@test.com' },
      ];

      axios.get.mockImplementationOnce(() =>
        Promise.resolve({ data: mockUsers })
      );

      const result = await getUsers();

      expect(result).toEqual(mockUsers);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/users')
      );
    });

    test('lève une erreur en cas d\'échec réseau', async () => {
      axios.get.mockImplementationOnce(() =>
        Promise.reject(new Error('Network Error'))
      );

      await expect(getUsers()).rejects.toThrow('Network Error');
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    test('lève une erreur en cas de réponse 500', async () => {
      axios.get.mockImplementationOnce(() =>
        Promise.reject(new Error('Request failed with status code 500'))
      );

      await expect(getUsers()).rejects.toThrow('500');
    });
  });

  describe('createUser', () => {
    test('crée un utilisateur et retourne la réponse avec id en cas de succès', async () => {
      const userData = {
        firstName: 'Alice',
        lastName: 'Dupont',
        email: 'alice@test.com',
        birthDate: '1995-06-15',
        postalCode: '75001',
        city: 'Paris',
      };
      const mockResponse = { id: 11, ...userData };

      axios.post.mockImplementationOnce(() =>
        Promise.resolve({ data: mockResponse })
      );

      const result = await createUser(userData);

      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        userData
      );
    });

    test('lève une erreur en cas d\'échec lors de la création', async () => {
      axios.post.mockImplementationOnce(() =>
        Promise.reject(new Error('Server Error'))
      );

      await expect(createUser({})).rejects.toThrow('Server Error');
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    test('mockImplementationOnce - comportements différents sur plusieurs appels', async () => {
      const userData = { firstName: 'Test', lastName: 'User' };

      axios.post
        .mockImplementationOnce(() => Promise.resolve({ data: { id: 1, ...userData } }))
        .mockImplementationOnce(() => Promise.reject(new Error('Erreur serveur')));

      const firstResult = await createUser(userData);
      expect(firstResult.id).toBe(1);

      await expect(createUser(userData)).rejects.toThrow('Erreur serveur');
      expect(axios.post).toHaveBeenCalledTimes(2);
    });
  });
});
