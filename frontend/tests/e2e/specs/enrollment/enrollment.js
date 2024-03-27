describe('Enrollment', () => {
    beforeEach(() => {
      cy.deleteAllButArs();
      cy.createDemoEntitiesForEnrollment();
    });
  
    afterEach(() => {
      cy.deleteAllButArs();
    });

    it('enroll in activity', () => {

        // Enter in Member Demo
        cy.demoMemberLogin()
        // intercept create activity request and inject date values in the request body
        cy.intercept('POST', '/activities/1/enrollments', (req) => {
            req.body = {
            };
        }).as('register');
        // intercept get institutions
        cy.intercept('GET', '/users/*/getInstitution').as('getInstitutions');
        cy.intercept('GET', '/themes/availableThemes').as('availableTeams')
        cy.get('[data-cy="institution"]').click();

        cy.get('[data-cy="activities"]').click();
        cy.wait('@getInstitutions');

        // Check if there are 3 activities
        cy.get('[data-cy="memberActivitiesTable"] tbody tr')
        .should('have.length', 3);
        // Check if the first activity has 0 applications
        cy.get('[data-cy="memberActivitiesTable"] tbody tr')
        .eq(0).children().eq(4).should('contain', 0);
        cy.logout();

        // Enter in Volunteer Demo
        cy.demoVolunteerLogin()
        // intercept get activities request
        cy.intercept('GET', '/activities').as('getActivities');
        // go to volunteer activities view
        cy.get('[data-cy="volunteerActivities"]').click();
        // check request was done
        cy.wait('@getActivities');
        cy.get('[data-cy="applyButton"]').first().click();
        cy.get('[data-cy="motivationInput"]').type('Motivation Long Enough');
        cy.get('[data-cy="saveEnrollment"]').click();
        // check request was done
        cy.wait('@register')
        cy.logout();

        // Enter in Member Demo
        cy.demoMemberLogin()
        // intercept get institutions
        cy.intercept('GET', '/users/*/getInstitution').as('getInstitutions');
        cy.intercept('GET', '/themes/availableThemes').as('availableTeams')
        cy.get('[data-cy="institution"]').click();

        cy.get('[data-cy="activities"]').click();
        cy.wait('@getInstitutions');

        // Check if there are 3 activities
        cy.get('[data-cy="memberActivitiesTable"] tbody tr')
        .should('have.length', 3);
        // Check if the first activity has 1 applications
        cy.get('[data-cy="memberActivitiesTable"] tbody tr')
        .eq(0).children().eq(4).should('contain', 1);
        // Check motivation
        cy.get('[data-cy="showEnrollments"]').first().click();
        cy.get('[data-cy="activityEnrollmentsTable"] tbody tr').
        should('have.length', 1);
        cy.get('[data-cy="activityEnrollmentsTable"] tbody tr')
        .eq(0).children().eq(1).should('contain', 'Motivation Long Enough');
        cy.logout();

        

    });
});