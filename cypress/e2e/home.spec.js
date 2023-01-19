import user from '../../cypress/fixtures/user.json'

const TSKS_AUTH_TOKEN_NAME = process.env.TSKS_AUTH_TOKEN_NAME

describe('Homepage', () => {
  describe('when has session', () => {
    beforeEach(() => {
      cy.session('session', () => {
        window.localStorage.setItem(TSKS_AUTH_TOKEN_NAME, JSON.stringify(user))
      })
    })

    afterEach(() => {
      cy.window().then(window =>
        window.localStorage.removeItem(TSKS_AUTH_TOKEN_NAME)
      )
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
