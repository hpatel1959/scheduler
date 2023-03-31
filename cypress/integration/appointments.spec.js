describe('Appointments', () => {
  
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains('Monday');
  })

  it('should book interview', () => {
    cy.get('[alt="Add"]')
      .first()
      .click();

    cy.get('[data-testid="student-name-input"]')
      .type('Lydia Miller-Jones');
    
    cy.get("[alt='Sylvia Palmer']").click();

    cy.contains('Save').click();

    cy.contains(".appointment__card--show", 'Lydia Miller-Jones');
    cy.contains(".appointment__card--show", 'Sylvia Palmer');
  })

  it('should edit interview', () => {
    cy.get('[alt="Edit"]')
      .first()
      .click({force: true});

    cy.get('[data-testid="student-name-input"]')
      .clear()
      .type('Harsh Patel');
    
    cy.get("[alt='Tori Malcolm']").click();

    cy.contains('Save').click();

    cy.contains(".appointment__card--show", 'Harsh Patel');
    cy.contains(".appointment__card--show", 'Tori Malcolm');
  })

  it('should cancel interview', () => {
    cy.get('[alt="Delete"]')
      .first()
      .click({force: true});

    cy.contains('button', "Confirm").click();

    cy.contains('Deleting...');

    cy.contains('Deleting...').should('not.exist');

    cy.contains('.appointment__item--show', 'Archie Cohen').should('not.exist');
  })
});