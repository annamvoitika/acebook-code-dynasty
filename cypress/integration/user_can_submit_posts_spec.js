describe('Timeline', function() {
  it('can submit posts and view them', function() {
    cy.visit('/sign_up');
    cy.get('#sign-up-form').find('[type="text"]').type('Shabba');
    cy.get('#sign-up-form').find('[type="email"]').type('shabba@gmail.com');
    cy.get('#sign-up-form').find('[type="password"]').type('shabba');
    cy.get('#sign-up-form').submit();

    cy.get('#sign-in-form').find('[type="email"]').type('shabba@gmail.com');
    cy.get('#sign-in-form').find('[type="password"]').type('shabba');
    cy.get('#sign-in-form').submit();

    cy.visit('/posts');
    cy.contains('New post').click();

    cy.get('#new-post-form').find('[type="text"]').type('Hello, world!');
    cy.get('#new-post-form').submit();

    cy.get('.posts').should('contain', 'Hello, world!');
  });
});
