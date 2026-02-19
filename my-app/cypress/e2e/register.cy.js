describe("Parcours d'inscription", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("Scénario Nominal : ajout réussi, compteur passe de 0 à 1 et utilisateur apparaît dans la liste", () => {
    // Aller à l'accueil et vérifier état initial
    cy.visit('/');
    cy.get('[data-cy="user-count"]').should('contain', '0 utilisateur(s) inscrit(s)');
    cy.get('[data-cy="empty-list"]').should('be.visible');

    // Naviguer vers le formulaire
    cy.get('[data-cy="go-to-form"]').click();
    cy.url().should('include', '/register');

    // Remplir le formulaire avec des données valides
    cy.get('#firstName').type('Alice');
    cy.get('#lastName').type('Dupont');
    cy.get('#email').type('alice.dupont@example.com');
    cy.get('#birthDate').type('1995-06-15');
    cy.get('#postalCode').type('75001');
    cy.get('#city').type('Paris');

    // Le bouton doit être actif et soumettre
    cy.get('[aria-label="Soumettre le formulaire"]').should('not.be.disabled').click();

    // Vérifier la redirection vers l'accueil
    cy.url().should('not.include', '/register');

    // Vérifier 1 utilisateur inscrit et présence dans la liste
    cy.get('[data-cy="user-count"]').should('contain', '1 utilisateur(s) inscrit(s)');
    cy.get('[data-cy="users-list"]').should('be.visible');
    cy.get('[data-cy="user-item"]').should('have.length', 1);
    cy.get('[data-cy="user-item"]').should('contain', 'Dupont').and('contain', 'Alice');
  });

  it("Scénario d'Erreur : tentative invalide, compteur reste à 1 et liste inchangée", () => {
    // Pré-charger 1 utilisateur en localStorage
    cy.window().then((win) => {
      win.localStorage.setItem(
        'users',
        JSON.stringify([
          {
            firstName: 'Alice',
            lastName: 'Dupont',
            email: 'alice.dupont@example.com',
            birthDate: '1995-06-15',
            postalCode: '75001',
            city: 'Paris',
          },
        ])
      );
    });

    // Vérifier l'état initial (1 inscrit)
    cy.visit('/');
    cy.get('[data-cy="user-count"]').should('contain', '1 utilisateur(s) inscrit(s)');
    cy.get('[data-cy="user-item"]').should('have.length', 1);

    // Naviguer vers le formulaire
    cy.get('[data-cy="go-to-form"]').click();
    cy.url().should('include', '/register');

    // Saisie invalide : prénom avec des chiffres
    cy.get('#firstName').type('123abc');
    cy.get('#firstName').blur();

    // Vérifier qu'une erreur est affichée
    cy.get('[role="alert"]').should('be.visible');

    // Le bouton doit rester désactivé
    cy.get('[aria-label="Soumettre le formulaire"]').should('be.disabled');

    // Retour à l'accueil sans soumission
    cy.visit('/');

    // Vérifier que toujours 1 utilisateur et la liste est inchangée
    cy.get('[data-cy="user-count"]').should('contain', '1 utilisateur(s) inscrit(s)');
    cy.get('[data-cy="user-item"]').should('have.length', 1);
    cy.get('[data-cy="user-item"]').should('contain', 'Dupont').and('contain', 'Alice');
  });
});
