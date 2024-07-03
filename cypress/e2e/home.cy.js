describe('homepage', () => {
  describe('when has session', () => {
    before(() => {
      cy.setLocalStorageUser()
    })

    after(() => {
      cy.removeLocalStorageUser()
    })

    beforeEach(() => {
      cy.visit('/')
    })

    it('redirects to tsks', () => {
      cy.location('pathname').should('eq', '/tsks')
    })
  })

  describe('when has not session', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('redirects to signin', () => {
      cy.location('pathname').should('eq', '/signin')
    })
  })
})
