import user from '../../cypress/fixtures/user.json'

describe('Homepage', () => {
  describe('when has session', () => {
    beforeEach(() => {
      cy.session('session', () => {
        window.localStorage.setItem('@tsks-user', JSON.stringify(user))
      })
    })

    afterEach(() => {
      window.localStorage.removeItem('@tsks-user')
    })

    it('redirects to tsks', () => {
      cy.visit('/')
      cy.location('pathname').should('eq', '/tsks')
    })
  })

  describe('when has not session', () => {
    it('redirects to signin', () => {
      cy.visit('/')
      cy.location('pathname').should('eq', '/signin')
    })
  })
})
