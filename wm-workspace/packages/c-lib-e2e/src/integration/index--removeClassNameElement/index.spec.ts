describe('c-lib: removeClassNameElement component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=removeclassnameelement--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to removeClassNameElement!');
    });
});
