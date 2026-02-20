describe("Parcours d'inscription", () => {
  it("Scénario Nominal : ajout réussi, compteur passe de 0 à 1 et utilisateur apparaît dans la liste", () => {
    // Intercepter GET /users → retourner liste vide
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: [],
    }).as('getUsers');

    // Intercepter POST /users → retourner l'utilisateur créé
    cy.intercept('POST', '**/users', {
      statusCode: 201,
      body: {
        id: 11,
        firstName: 'Alice',
        lastName: 'Dupont',
        email: 'alice.dupont@example.com',
        birthDate: '1995-06-15',
        postalCode: '75001',
        city: 'Paris',
      },
    }).as('createUser');

    cy.visit('/');
    cy.wait('@getUsers');

    // Vérifier état initial : 0 inscrits
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

    // Le bouton doit être actif — soumettre
    cy.get('[aria-label="Soumettre le formulaire"]').should('not.be.disabled').click();
    cy.wait('@createUser');

    // Vérifier la redirection vers l'accueil
    cy.url().should('not.include', '/register');

    // Vérifier 1 utilisateur inscrit et sa présence dans la liste
    cy.get('[data-cy="user-count"]').should('contain', '1 utilisateur(s) inscrit(s)');
    cy.get('[data-cy="users-list"]').should('be.visible');
    cy.get('[data-cy="user-item"]').should('have.length', 1);
    cy.get('[data-cy="user-item"]').should('contain', 'Dupont').and('contain', 'Alice');
  });

  it("Scénario d'Erreur : tentative invalide, compteur reste à 1 et liste inchangée", () => {
    const existingUsers = [
      {
        id: 1,
        firstName: 'Alice',
        lastName: 'Dupont',
        email: 'alice.dupont@example.com',
        birthDate: '1995-06-15',
        postalCode: '75001',
        city: 'Paris',
      },
    ];

    // Intercepter GET /users → retourner 1 utilisateur existant
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: existingUsers,
    }).as('getUsers');

    cy.visit('/');
    cy.wait('@getUsers');

    // Vérifier : 1 inscrit, liste avec l'utilisateur
    cy.get('[data-cy="user-count"]').should('contain', '1 utilisateur(s) inscrit(s)');
    cy.get('[data-cy="user-item"]').should('have.length', 1);

    // Naviguer vers le formulaire
    cy.get('[data-cy="go-to-form"]').click();
    cy.url().should('include', '/register');

    // Saisie invalide : prénom avec des chiffres
    cy.get('#firstName').type('123abc');
    cy.get('#firstName').blur();

    // Vérifier qu'une erreur de validation est affichée
    cy.get('[role="alert"]').should('be.visible');

    // Le bouton doit rester désactivé — aucune soumission
    cy.get('[aria-label="Soumettre le formulaire"]').should('be.disabled');

    // Retour à l'accueil sans soumission
    cy.visit('/');
    cy.wait('@getUsers');

    // Vérifier : toujours 1 inscrit, liste inchangée
    cy.get('[data-cy="user-count"]').should('contain', '1 utilisateur(s) inscrit(s)');
    cy.get('[data-cy="user-item"]').should('have.length', 1);
    cy.get('[data-cy="user-item"]').should('contain', 'Dupont').and('contain', 'Alice');
  });
});
