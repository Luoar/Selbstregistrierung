import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Stammdaten e2e test', () => {
  const stammdatenPageUrl = '/stammdaten';
  const stammdatenPageUrlPattern = new RegExp('/stammdaten(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const stammdatenSample = {};

  let stammdaten;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/stammdatens+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/stammdatens').as('postEntityRequest');
    cy.intercept('DELETE', '/api/stammdatens/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (stammdaten) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/stammdatens/${stammdaten.id}`,
      }).then(() => {
        stammdaten = undefined;
      });
    }
  });

  it('Stammdatens menu should load Stammdatens page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('stammdaten');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Stammdaten').should('exist');
    cy.url().should('match', stammdatenPageUrlPattern);
  });

  describe('Stammdaten page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(stammdatenPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Stammdaten page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/stammdaten/new$'));
        cy.getEntityCreateUpdateHeading('Stammdaten');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stammdatenPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/stammdatens',
          body: stammdatenSample,
        }).then(({ body }) => {
          stammdaten = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/stammdatens+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [stammdaten],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(stammdatenPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Stammdaten page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('stammdaten');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stammdatenPageUrlPattern);
      });

      it('edit button click should load edit Stammdaten page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Stammdaten');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stammdatenPageUrlPattern);
      });

      it('edit button click should load edit Stammdaten page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Stammdaten');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stammdatenPageUrlPattern);
      });

      it('last delete button click should delete instance of Stammdaten', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('stammdaten').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stammdatenPageUrlPattern);

        stammdaten = undefined;
      });
    });
  });

  describe('new Stammdaten page', () => {
    beforeEach(() => {
      cy.visit(`${stammdatenPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Stammdaten');
    });

    it('should create an instance of Stammdaten', () => {
      cy.get(`[data-cy="anrede"]`).select('Frau');

      cy.get(`[data-cy="nachname"]`).type('revolutionary Account').should('have.value', 'revolutionary Account');

      cy.get(`[data-cy="vorname"]`).type('Wooden Refined').should('have.value', 'Wooden Refined');

      cy.get(`[data-cy="eMail"]`).type('monitor Cyprus system-worthy').should('have.value', 'monitor Cyprus system-worthy');

      cy.get(`[data-cy="telefonMobile"]`).type('pixel').should('have.value', 'pixel');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        stammdaten = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', stammdatenPageUrlPattern);
    });
  });
});
