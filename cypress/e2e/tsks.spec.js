describe('Tsks', () => {
  it('renders a message when no tsks found', () => {
    cy.intercept('GET', '**/v1/tsks', {
      statusCode: 200,
      body: {
        ok: true,
        tsks: []
      }
    })

    cy.visit('/tsks')
    cy.get('.tsks-list').should('not.exist')
    cy.contains('No tsks found').should('exist')
  })

  it('renders a list of tsks', () => {
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
    cy.get('.tsks-list').should('exist')
    cy.get('.tsks-item').should('have.length', 7)
  })

  it('renders each tsk containing both tsk and context', () => {
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

    cy.get('.tsks-item').eq(0).within(() => {
      cy.get('.tsk-content').should('exist')
      cy.get('.tsk-context').should('exist')
    })
  })
})

