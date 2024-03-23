describe('Volunteer', () => {
  beforeEach(() => {
    cy.deleteAllButArs();
    cy.createDemoEntities();
  });

  afterEach(() => {
    cy.deleteAllButArs();
  });

  it('close', () => {
       const MOTIVATION = 'I want to help other people';
       cy.demoVolunteerLogin()

       // intercept get activities request
       cy.intercept('GET', '/activities').as('getActivities');
       // go to volunteer activities view
       cy.get('[data-cy="volunteerActivities"]').click();
       // check request was done
       cy.wait('@getActivities');
       cy.get('[data-cy="applyButton"]').click();
       cy.get('[data-cy="motivationInput"]').type(MOTIVATION);

       cy.get('[data-cy="saveEnrollment"]').click()
       // maybe a cy.wait register

       cy.get('[data-cy="activityEnrollmentsTable"] tbody tr')
         .should('have.length', 1)
         .eq(0)
         .children()
         .should('have.length', 12)
       cy.get('[data-cy="memberActivitiesTable"] tbody tr')
          .eq(0).children().eq(0).should('contain', NAME)
       cy.get('[data-cy="memberActivitiesTable"] tbody tr')
         .eq(0).children().eq(1).should('contain', REGION)
       cy.get('[data-cy="memberActivitiesTable"] tbody tr')
         .eq(0).children().eq(2).should('contain', NUMBER)
       cy.get('[data-cy="memberActivitiesTable"] tbody tr')
         .eq(0).children().eq(3).should('contain', MOTIVATION)
       cy.get('[data-cy="memberActivitiesTable"] tbody tr')
         .eq(0).children().eq(4).should('contain', DESCRIPTION);
       cy.logout();
  });
});
