import user from '../fixtures/user.json'

describe('SignUp', () => {
  context('signup succesfully', () => {
    const testApiPostRequest = {
      method: 'POST',
      endpoint: '**/v1/signup',
    }

    const testApiPostResponse = {
      statusCode: 201,
      body: {
        ok: true,
        user,
      },
    }

    beforeEach(() => {
      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signup')
      cy.get('.signup-email').type(user.email)
      cy.get('.signup-password').type('123')
      cy.get('[type="submit"]').click()
    })

    it('redirects to tsks', () => {
      cy.location('pathname').should('eq', '/tsks')
    })

    it('saves user on localStorage', () => {
      cy.wait(2000)
      cy.window().then(window => {
        const localStorageUser = JSON.parse(
          window.localStorage.getItem('@tsks-user')
        )

        expect(localStorageUser).to.deep.eq(user)
      })
    })
  })

  context('cannot without email', () => {
    beforeEach(() => {
      const testApiPostRequest = {
        method: 'POST',
        endpoint: '**/v1/signup',
      }

      const testApiPostResponse = {
        statusCode: 400,
        body: {
          ok: false,
          message: '400 Bad Request',
        },
      }

      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signup')
      cy.get('.signup-password').type('123')
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      cy.contains('400 Bad Request').should('exist')
    })
  })

  context('cannot without password', () => {
    beforeEach(() => {
      const testApiPostRequest = {
        method: 'POST',
        endpoint: '**/v1/signup',
      }

      const testApiPostResponse = {
        statusCode: 400,
        body: {
          ok: false,
          message: '400 Bad Request',
        },
      }

      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signup')
      cy.get('.signup-email').type(user.email)
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      cy.contains('400 Bad Request').should('exist')
    })
  })

  context('cannot with invalid email', () => {
    beforeEach(() => {
      const testApiPostRequest = {
        method: 'POST',
        endpoint: '**/v1/signup',
      }

      const testApiPostResponse = {
        statusCode: 400,
        body: {
          ok: false,
          message: '400 Bad Request',
        },
      }

      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signup')
      cy.get('.signup-email').type('invalid email')
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      cy.contains('400 Bad Request').should('exist')
    })
  })

  context('cannot with already registered email', () => {
    const testApiPostRequest = {
      method: 'POST',
      endpoint: '**/v1/signup',
    }

    const testApiPostResponse = {
      statusCode: 409,
      body: {
        ok: false,
        message: '409 Conflict',
      },
    }

    beforeEach(() => {
      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signup')
      cy.get('.signup-email').type(user.email)
      cy.get('.signup-email').type('123')
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      cy.contains('409 Conflict').should('exist')
    })
  })
})
