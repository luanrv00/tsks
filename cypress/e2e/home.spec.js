describe('Home', () => {
  it('redirects to signup if not logged in', () => {
    cy.visit('/')
    cy.location('pathname').should('eq', '/signup')
  })

  it('redirects to tsks list if logged in', () => {
    localStorage.setItem('@tsks-user', JSON.stringify({id: true}))
    cy.visit('/')
    cy.location('pathname').should('eq', '/tsks')
  })
})
