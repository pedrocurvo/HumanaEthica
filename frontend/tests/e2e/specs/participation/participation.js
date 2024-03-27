describe('Participation', () => {
  beforeEach(() => {
    cy.deleteAllButArs();
    cy.createParticipationEntities();
  });

  afterEach(() => {
    cy.deleteAllButArs();
  });

  let test = it('verifies activities and enrollments as a member', () => {
    // (Apenas) Membro faz login e vai à activities page
    cy.demoMemberLogin();

    cy.intercept('GET', '/users/*/getInstitution').as('getInstitutions');
    cy.intercept('GET', '/activities').as('getActivities');
    cy.intercept('GET', '/themes/availableThemes').as('availableTeams')

    // Abrir página actividades
    cy.get('[data-cy="institution"]').click();

    cy.get('[data-cy="activities"]').click();
    cy.wait('@getInstitutions');

    // Verificar que a tabela de atividades tem 2 instâncias
    cy.get('[data-cy="memberActivitiesTable"] tbody tr')
        .should('have.length', 2);

    // Verificar que a primeira atividade da tabela tem 1 participação
    cy.get('[data-cy="memberActivitiesTable"] tbody tr').eq(0).children()
        .eq(2) // 'number of participations' está na terceira coluna (index 2)
        .should('contain', '1');

    // intercept get enrollments request
    cy.intercept('GET', '/activities/*/enrollments').as('getEnrollments');

    // intercept get participation request
    cy.intercept('GET', '/activities/*/participations').as('getParticipations');

    // Selecionar Show Enrollments (botao UI Show Applications) da primeira atividade da tabela
    cy.get('[data-cy="showEnrollments"]').first().click();

    // check request was done
    cy.wait('@getEnrollments');

    // check request was done
    cy.wait('@getParticipations');

    // Verificar que a tabela dos enrollments da atividade tem 2 instâncias
    cy.get('[data-cy="activityEnrollmentsTable"] tbody tr')
        .should('have.length', 2);

    // Verificar que o primeiro enrollment da tabela tem a coluna Participating como false
    cy.get('[data-cy="activityEnrollmentsTable"] tbody tr').eq(0).children()
        .eq(2) // "Participating" está na terceira coluna (índex 2)
        .should('contain', 'false');

    // Criar uma participação para esse enrollment
    cy.get('[data-cy="selectParticipant"]').first().click();

    // Verificar que o dialog de participação foi aberto e, se sim, ao abrir o dialog atribuir rating de 3 à participação
    cy.get('[data-cy="participantionRating"]').should('be.visible').type('3');

    // intercept create participation request
    cy.intercept('POST', '/activities/*/participations').as('createParticipation');

    // click no botão de confirmação
    cy.get('[data-cy="makeParticipation"]').click();

    // check request was done
    cy.wait('@createParticipation');

    // Verificar que o primeiro enrollment que passou a ter participação tem a coluna Participating como true
    cy.get('[data-cy="activityEnrollmentsTable"] tbody tr').eq(0).children()
        .eq(2) // Adjust if the actual column index is different
        .should('contain', 'true');

    // Voltar à tabela de atividades
    cy.get('[data-cy="getActivities"]').click();

    // e verificar que a atividade passou a ter 2 participações
    cy.get('[data-cy="memberActivitiesTable"] tbody tr').eq(0).children()
        .eq(2) // Adjust the index based on the actual UI
        .should('contain', '2');

    //logout after test
    cy.logout()

  });
});
