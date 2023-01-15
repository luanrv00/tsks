import user from '../fixtures/user.json'

describe('SignIn', () => {
  describe('signin succesfully', () => {
    const testApiPostRequest = {
      method: 'POST',
      endpoint: '**/v1/signin',
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

      cy.visit('/signin')
      cy.get('.user-email').type(user.email)
      cy.get('.user-password').type('123')
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

  describe('cannot without email', () => {
    const testApiPostRequest = {
      method: 'POST',
      endpoint: '**/v1/signin',
    }

    const testApiPostResponse = {
      statusCode: 400,
      body: {
        ok: false,
        message: '400 Bad Request',
      },
    }

    beforeEach(() => {
      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signin')
      cy.get('.user-password').type('123')
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      cy.contains('400 Bad Request').should('exist')
    })
  })

  describe('cannot without password', () => {
    const testApiPostRequest = {
      method: 'POST',
      endpoint: '**/v1/signin',
    }

    const testApiPostResponse = {
      statusCode: 400,
      body: {
        ok: false,
        message: '400 Bad Request',
      },
    }

    beforeEach(() => {
      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signin')
      cy.get('.user-email').type(user.email)
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      cy.contains('400 Bad Request').should('exist')
    })
  })

  describe('cannot with wrong password', () => {
    const testApiPostRequest = {
      method: 'POST',
      endpoint: '**/v1/signin',
    }

    const testApiPostResponse = {
      statusCode: 401,
      body: {
        ok: false,
        message: '401 Unauthorized',
      },
    }

    beforeEach(() => {
      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signin')
      cy.get('.user-email').type(user.email)
      cy.get('.user-password').type('123')
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      cy.contains('401 Unauthorized').should('exist')
    })
  })

  describe('cannot with not registered email', () => {
    const testApiPostRequest = {
      method: 'POST',
      endpoint: '**/v1/signin',
    }

    const testApiPostResponse = {
      statusCode: 404,
      body: {
        ok: false,
        message: '404 Not Found',
      },
    }

    beforeEach(() => {
      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signin')
      cy.get('.user-email').type(user.email)
      cy.get('.user-password').type('123')
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      cy.contains('404 Not Found').should('exist')
    })
  })

  describe('cannot with invalid email', () => {
    const testApiPostRequest = {
      method: 'POST',
      endpoint: '**/v1/signin',
    }

    const testApiPostResponse = {
      statusCode: 400,
      body: {
        ok: false,
        message: '400 Bad Request',
      },
    }

    beforeEach(() => {
      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signin')
      cy.get('.user-email').type('invalid email')
      cy.get('.user-password').type('123')
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      cy.contains('400 Bad Request').should('exist')
    })
  })
})
