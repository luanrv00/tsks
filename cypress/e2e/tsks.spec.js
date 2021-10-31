describe('Tsks', () => {
  it('are grouped by context', () => {
    cy.fixture('tsks').then(tsksJson => {
      cy.intercept('GET', '**/v1/tsks', {
        statusCode: 200,
        body: {
          ok: true,
          tsks: tsksJson
        }
      })
    })

    cy.visit('/tsks')
    cy.get('.tsks-group').should('have.length', 2)
  })

  it('tsks groups are rendered containing the context and a tsks list', () => {
    cy.fixture('tsks').then(tsksJson => {
      cy.intercept('GET', '**/v1/tsks', {
        statusCode: 200,
        body: {
          ok: true,
          tsks: tsksJson
        }
      })
    })

    cy.visit('/tsks')

    cy.get('.tsks-group').eq(0).within(() => {
      cy.get('.tsks-context').should('exist')
      cy.get('.tsks-list').should('exist')
    })
  })

  it('renders a message when no tsks found', () => {
    cy.intercept('GET', '**/v1/tsks', {
      statusCode: 200,
      body: {
        ok: true,
        tsks: []
      }
    })

    cy.visit('/tsks')
    cy.get('.tsks.group').should('not.exist')
    cy.contains('No tsks found').should('exist')
  })
})

