describe("Parcours d'inscription E2E (API réelle)", () => {
  it("Scénario Nominal : inscription réussie, compteur augmente et utilisateur apparaît dans la liste", () => {
    cy.visit('/');

    cy.get('[data-cy="user-count"]', { timeout: 15000 }).should('be.visible');

    cy.get('[data-cy="user-count"]').invoke('text').then((text) => {
      const initialCount = parseInt(text.match(/(\d+)/)[1]);

      cy.get('[data-cy="go-to-form"]').click();
      cy.url().should('include', '/register');

      const uniqueEmail = `cypress-${Date.now()}@test.com`;
      cy.get('#firstName').type('Alice');
      cy.get('#lastName').type('Dupont');
      cy.get('#email').type(uniqueEmail);
      cy.get('#birthDate').type('1995-06-15');
      cy.get('#postalCode').type('75001');
      cy.get('#city').type('Paris');

      cy.get('[aria-label="Soumettre le formulaire"]').should('not.be.disabled').click();

      cy.url({ timeout: 10000 }).should('not.include', '/register');

      cy.get('[data-cy="user-count"]').should('contain', `${initialCount + 1} utilisateur(s) inscrit(s)`);

      cy.get('[data-cy="users-list"]').should('be.visible');
      cy.get('[data-cy="user-item"]').should('contain', 'Dupont');
    });
  });

  it("Scénario d'Erreur : validation côté client empêche la soumission, liste inchangée", () => {
    cy.visit('/');

    cy.get('[data-cy="user-count"]', { timeout: 15000 }).should('be.visible');

    cy.get('[data-cy="user-count"]').invoke('text').then((text) => {
      const currentCount = parseInt(text.match(/(\d+)/)[1]);

      cy.get('[data-cy="go-to-form"]').click();
      cy.url().should('include', '/register');

      cy.get('#firstName').type('123abc');
      cy.get('#firstName').blur();

      cy.get('[role="alert"]').should('be.visible');

      cy.get('[aria-label="Soumettre le formulaire"]').should('be.disabled');

      cy.visit('/');
      cy.get('[data-cy="user-count"]', { timeout: 15000 }).should('contain', `${currentCount} utilisateur(s) inscrit(s)`);
    });
  });
});
