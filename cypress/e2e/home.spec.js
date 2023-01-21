import user from '../../cypress/fixtures/user.json'

const {NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY} = process.env

describe('Homepage', () => {
  describe('when has session', () => {
    beforeEach(() => {
      cy.session('session', () => {
        window.localStorage.setItem(
          NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY,
          JSON.stringify(user)
        )
      })
    })

    afterEach(() => {
      cy.window().then(window =>
        window.localStorage.removeItem(NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY)
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
