describe('Homepage', () => {
  describe('when has session', () => {
    cy.fixture('user').as('user')

    beforeAll(() => {
      localStorage.setItem('@tsks-user', user)
    })

    afterAll(() => {
      localStorage.removeItem('@tsks-user')
    })

    it('redirects to tsks', () => {
      cy.visit('/')
      cy.location('pathname').should('eq', '/tsks')
    })
  })

  describe('when has not session', () => {
    it('redirects to signup', () => {
      cy.visit('/')
      cy.location('pathname').should('eq', '/signup')
    })
  })
})
