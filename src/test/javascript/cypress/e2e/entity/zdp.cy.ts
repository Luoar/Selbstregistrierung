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

describe('ZDP e2e test', () => {
  const zDPPageUrl = '/zdp';
  const zDPPageUrlPattern = new RegExp('/zdp(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const zDPSample = {};

  let zDP;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/zdps+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/zdps').as('postEntityRequest');
    cy.intercept('DELETE', '/api/zdps/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (zDP) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/zdps/${zDP.id}`,
      }).then(() => {
        zDP = undefined;
      });
    }
  });

  it('ZDPS menu should load ZDPS page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('zdp');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ZDP').should('exist');
    cy.url().should('match', zDPPageUrlPattern);
  });

  describe('ZDP page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(zDPPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ZDP page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/zdp/new$'));
        cy.getEntityCreateUpdateHeading('ZDP');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', zDPPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/zdps',
          body: zDPSample,
        }).then(({ body }) => {
          zDP = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/zdps+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [zDP],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(zDPPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ZDP page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('zDP');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', zDPPageUrlPattern);
      });

      it('edit button click should load edit ZDP page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ZDP');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', zDPPageUrlPattern);
      });

      it('edit button click should load edit ZDP page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ZDP');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', zDPPageUrlPattern);
      });

      it('last delete button click should delete instance of ZDP', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('zDP').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', zDPPageUrlPattern);

        zDP = undefined;
      });
    });
  });

  describe('new ZDP page', () => {
    beforeEach(() => {
      cy.visit(`${zDPPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ZDP');
    });

    it('should create an instance of ZDP', () => {
      cy.get(`[data-cy="zdpNummer"]`).type('89719').should('have.value', '89719');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        zDP = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', zDPPageUrlPattern);
    });
  });
});
