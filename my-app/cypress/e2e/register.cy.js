/**
 * Tests E2E - Parcours d'inscription utilisateur
 * Scénarios issus du cours "Intégration déploiement - Test end-to-end"
 */

describe("Parcours d'inscription", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  // -----------------------------------------------------------------------
  // Scénario 1 : Ajout réussi d'un utilisateur
  // Navigation → 0 users → formulaire → soumission OK → home → 1 user
  // -----------------------------------------------------------------------
  it('Scénario 1 : ajout réussi - le compteur passe de 0 à 1', () => {
    // Arrivée sur la page d'accueil - aucun utilisateur
    cy.visit('/');
    cy.get('[data-cy="user-count"]').should('contain', '0 user(s) already registered');

    // Navigation vers le formulaire
    cy.get('[data-cy="go-to-form"]').click();
    cy.url().should('include', '/register');

    // Remplissage du formulaire sans erreur
    cy.get('#firstName').type('Alice');
    cy.get('#lastName').type('Dupont');
    cy.get('#email').type('alice.dupont@example.com');
    cy.get('#birthDate').type('1995-06-15');
    cy.get('#postalCode').type('75001');
    cy.get('#city').type('Paris');

    // Le bouton doit être actif
    cy.get('[aria-label="Soumettre le formulaire"]').should('not.be.disabled');

    // Soumission
    cy.get('[aria-label="Soumettre le formulaire"]').click();

    // Toast de succès visible
    cy.contains('Formulaire soumis avec succès !').should('be.visible');

    // Retour à la page d'accueil
    cy.visit('/');

    // Un utilisateur inscrit
    cy.get('[data-cy="user-count"]').should('contain', '1 user(s) already registered');
  });

  // -----------------------------------------------------------------------
  // Scénario 2 : Tentative avec erreur - compteur inchangé
  // Navigation → 1 user → formulaire → erreur → home → toujours 1 user
  // -----------------------------------------------------------------------
  it('Scénario 2 : ajout avec erreur - le compteur reste à 1', () => {
    // Pré-remplir localStorage avec 1 utilisateur existant
    cy.window().then((win) => {
      win.localStorage.setItem(
        'userData',
        JSON.stringify({
          firstName: 'Alice',
          lastName: 'Dupont',
          email: 'alice.dupont@example.com',
          birthDate: '1995-06-15',
          postalCode: '75001',
          city: 'Paris',
        })
      );
    });

    // Arrivée sur la page d'accueil - 1 utilisateur inscrit
    cy.visit('/');
    cy.get('[data-cy="user-count"]').should('contain', '1 user(s) already registered');

    // Navigation vers le formulaire
    cy.get('[data-cy="go-to-form"]').click();

    // Saisie d'un prénom invalide (chiffres)
    cy.get('#firstName').type('123');
    cy.get('#firstName').blur();

    // Message d'erreur visible
    cy.get('[role="alert"]').should('be.visible');

    // Le bouton reste désactivé
    cy.get('[aria-label="Soumettre le formulaire"]').should('be.disabled');

    // Retour à la page d'accueil sans avoir soumis
    cy.visit('/');

    // Toujours 1 utilisateur inscrit
    cy.get('[data-cy="user-count"]').should('contain', '1 user(s) already registered');
  });
});
