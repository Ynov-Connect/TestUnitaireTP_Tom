import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UserForm from './UserForm';
import { UsersProvider } from './UsersContext';

const renderUserForm = () =>
  render(
    <UsersProvider>
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>
    </UsersProvider>
  );

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
  ToastContainer: () => null,
}));

describe('UserForm - Tests d\'intégration', () => {
  let localStorageMock;

  beforeEach(() => {
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock;

    jest.clearAllMocks();
  });

  describe('Affichage initial du formulaire', () => {
    test('affiche tous les champs requis', () => {
      renderUserForm();

      expect(screen.getByLabelText(/^prénom/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^nom \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date de naissance/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/code postal/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^ville/i)).toBeInTheDocument();
    });

    test('le bouton de soumission est désactivé initialement', () => {
      renderUserForm();
      const submitButton = screen.getByRole('button', { name: /soumettre/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Validation en temps réel - Scénarios chaotiques', () => {
    test('affiche une erreur quand un prénom invalide est saisi puis corrige', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const firstNameInput = screen.getByLabelText(/prénom/i);

      await user.type(firstNameInput, 'Jean123');
      await user.tab(); 

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          /ne doit contenir que des lettres/i
        );
      });

      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Jean');

      await waitFor(() => {
        const alerts = screen.queryAllByRole('alert');
        const hasInvalidCharError = alerts.some(alert =>
          alert.textContent.includes('ne doit contenir que des lettres')
        );
        expect(hasInvalidCharError).toBe(false);
      });
    });

    test('détecte une tentative XSS dans le prénom', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const firstNameInput = screen.getByLabelText(/prénom/i);

      await user.type(firstNameInput, '<script>alert("XSS")</script>');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/balises HTML/i);
      });
    });

    test('valide un email invalide puis le corrige', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const emailInput = screen.getByLabelText(/email/i);

      await user.type(emailInput, 'invalide@');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/format.*email.*invalide/i);
      });

      await user.clear(emailInput);
      await user.type(emailInput, 'valide@example.com');

      await waitFor(() => {
        const alerts = screen.queryAllByRole('alert');
        const hasEmailFormatError = alerts.some(alert =>
          alert.textContent.includes('format') && alert.textContent.includes('email')
        );
        expect(hasEmailFormatError).toBe(false);
      });
    });

    test('rejette un âge inférieur à 18 ans', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const birthDateInput = screen.getByLabelText(/date de naissance/i);

      const today = new Date();
      const fifteenYearsAgo = new Date(
        today.getFullYear() - 15,
        today.getMonth(),
        today.getDate()
      );
      const dateString = fifteenYearsAgo.toISOString().split('T')[0];

      await user.type(birthDateInput, dateString);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/insuffisant/i);
      });
    });

    test('valide un code postal invalide (pas 5 chiffres)', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const postalCodeInput = screen.getByLabelText(/code postal/i);

      await user.type(postalCodeInput, '123');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/5 chiffres/i);
      });

      await user.clear(postalCodeInput);
      await user.type(postalCodeInput, '75001');

      await waitFor(() => {
        const alerts = screen.queryAllByRole('alert');
        const hasFiveDigitsError = alerts.some(alert =>
          alert.textContent.includes('5 chiffres')
        );
        expect(hasFiveDigitsError).toBe(false);
      });
    });

    test('rejette un code postal avec des lettres', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const postalCodeInput = screen.getByLabelText(/code postal/i);

      await user.type(postalCodeInput, '750AB');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/5 chiffres/i);
      });
    });
  });

  describe('Utilisateur chaotique - Scénario complet', () => {
    test('remplit le formulaire de manière désordonnée avec erreurs et corrections', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const firstNameInput = screen.getByLabelText(/^prénom/i);
      const lastNameInput = screen.getByLabelText(/^nom \*/i);
      const emailInput = screen.getByLabelText(/^email/i);
      const birthDateInput = screen.getByLabelText(/date de naissance/i);
      const postalCodeInput = screen.getByLabelText(/code postal/i);
      const cityInput = screen.getByLabelText(/^ville/i);
      const submitButton = screen.getByRole('button', { name: /soumettre/i });

      await user.type(emailInput, 'mauvais-email');
      await user.tab();
      expect(await screen.findByRole('alert')).toBeInTheDocument();

      await user.type(firstNameInput, 'Jean123');
      await user.tab();
      expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(2);

      expect(submitButton).toBeDisabled();

      await user.clear(emailInput);
      await user.type(emailInput, 'jean.dupont@example.com');
      await user.tab();

      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Jean');
      await user.tab();

      await user.type(lastNameInput, 'Dupont');
      await user.tab();

      const futureDate = '2030-01-01';
      await user.type(birthDateInput, futureDate);
      await user.tab();
      expect(await screen.findByRole('alert')).toHaveTextContent(/futur/i);

      await user.clear(birthDateInput);
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 25);
      await user.type(birthDateInput, validDate.toISOString().split('T')[0]);
      await user.tab();

      await user.type(postalCodeInput, '123');
      await user.tab();

      await user.clear(postalCodeInput);
      await user.type(postalCodeInput, '75001');
      await user.tab();

      await user.type(cityInput, 'Paris');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      }, { timeout: 3000 });
    });
  });

  describe('Soumission du formulaire et état du bouton', () => {
    test('le bouton reste désactivé si tous les champs ne sont pas remplis', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const firstNameInput = screen.getByLabelText(/prénom/i);
      const submitButton = screen.getByRole('button', { name: /soumettre/i });

      await user.type(firstNameInput, 'Jean');
      await user.tab();

      expect(submitButton).toBeDisabled();
    });

    test('le bouton s\'active quand tous les champs sont valides', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const submitButton = screen.getByRole('button', { name: /soumettre/i });
      
      expect(submitButton).toBeDisabled();

      await user.type(screen.getByLabelText(/^prénom/i), 'Jean');
      await user.type(screen.getByLabelText(/^nom \*/i), 'Dupont');
      await user.type(screen.getByLabelText(/^email/i), 'jean.dupont@example.com');

      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 25);
      const dateString = validDate.toISOString().split('T')[0];
      await user.type(screen.getByLabelText(/date de naissance/i), dateString);

      await user.type(screen.getByLabelText(/code postal/i), '75001');
      await user.type(screen.getByLabelText(/^ville/i), 'Paris');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      }, { timeout: 3000 });
    });

  });

  describe('Tests de régression et cas limites', () => {
    test('gère les caractères accentués dans les noms', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const firstNameInput = screen.getByLabelText(/^prénom/i);

      await user.type(firstNameInput, 'François');

      await waitFor(() => {
        const alerts = screen.queryAllByRole('alert');
        const hasAccentError = alerts.some(alert =>
          alert.textContent.includes('ne doit contenir que des lettres')
        );
        expect(hasAccentError).toBe(false);
      });
    });

    test('accepte les noms composés avec tirets', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const lastNameInput = screen.getByLabelText(/^nom \*/i);

      await user.type(lastNameInput, 'Dupont-Martin');

      await waitFor(() => {
        const alerts = screen.queryAllByRole('alert');
        const hasHyphenError = alerts.some(alert =>
          alert.textContent.includes('ne doit contenir que des lettres')
        );
        expect(hasHyphenError).toBe(false);
      });
    });

    test('accepte les apostrophes dans les noms', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const lastNameInput = screen.getByLabelText(/^nom \*/i);

      await user.type(lastNameInput, "O'Connor");

      await waitFor(() => {
        const alerts = screen.queryAllByRole('alert');
        const hasApostropheError = alerts.some(alert =>
          alert.textContent.includes('ne doit contenir que des lettres')
        );
        expect(hasApostropheError).toBe(false);
      });
    });

    test('valide un utilisateur de 18 ans exactement', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const birthDateInput = screen.getByLabelText(/date de naissance/i);

      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      const dateString = eighteenYearsAgo.toISOString().split('T')[0];

      await user.type(birthDateInput, dateString);

      await waitFor(() => {
        const alerts = screen.queryAllByRole('alert');
        const hasAgeError = alerts.some(alert =>
          alert.textContent.includes('insuffisant') || alert.textContent.includes('minimum')
        );
        expect(hasAgeError).toBe(false);
      });
    });
  });

  describe('Tests du DOM et accessibilité', () => {
    test('les erreurs sont visibles et identifiables avec role="alert"', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const emailInput = screen.getByLabelText(/^email/i);

      await user.type(emailInput, 'invalide');
      await user.tab();

      const alert = await screen.findByRole('alert');
      expect(alert).toBeVisible();
      expect(alert).toHaveClass('error-message');
    });

    test('les champs en erreur ont la classe "error"', async () => {
      const user = userEvent.setup();
      renderUserForm();

      const emailInput = screen.getByLabelText(/email/i);

      await user.type(emailInput, 'invalide');
      await user.tab();

      await waitFor(() => {
        expect(emailInput).toHaveClass('error');
      });
    });

    test('le bouton a un état visuellement différent quand désactivé', () => {
      renderUserForm();

      const submitButton = screen.getByRole('button', { name: /soumettre/i });
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveClass('submit-button');
    });
  });

  describe('Soumission complète du formulaire', () => {
    test('gère la soumission avec validation des erreurs', async () => {
      renderUserForm();

      fireEvent.change(screen.getByLabelText(/^prénom/i), { target: { value: 'Jean123' } });
      fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'invalide' } });

      fireEvent.submit(screen.getByTestId('registration-form'));

      await waitFor(() => {
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
      });

      await waitFor(() => {
        const alerts = screen.queryAllByRole('alert');
        expect(alerts.length).toBeGreaterThan(0);
      });
    });

    test('soumet le formulaire avec succès, affiche le toast et réinitialise le formulaire', async () => {
      const { toast } = require('react-toastify');
      const user = userEvent.setup();
      renderUserForm();

      await user.type(screen.getByLabelText(/^prénom/i), 'Jean');
      await user.type(screen.getByLabelText(/^nom \*/i), 'Dupont');
      await user.type(screen.getByLabelText(/^email/i), 'jean.dupont@example.com');

      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 25);
      await user.type(
        screen.getByLabelText(/date de naissance/i),
        validDate.toISOString().split('T')[0]
      );
      await user.type(screen.getByLabelText(/code postal/i), '75001');
      await user.type(screen.getByLabelText(/^ville/i), 'Paris');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /soumettre/i })).not.toBeDisabled();
      }, { timeout: 3000 });

      await user.click(screen.getByRole('button', { name: /soumettre/i }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Formulaire soumis avec succès !',
          expect.any(Object)
        );
      });

      // Le formulaire est réinitialisé après soumission réussie
      await waitFor(() => {
        expect(screen.getByLabelText(/^prénom/i)).toHaveValue('');
      });
    });
  });
});
