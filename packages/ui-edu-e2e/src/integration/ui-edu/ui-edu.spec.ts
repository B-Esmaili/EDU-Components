describe('ui-edu: UiEdu component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=uiedu--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to UiEdu!');
    });
});
