describe('SignIn', () => {
  cy.fixture('user').as('user')

  describe('signin succesfully', () => {
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

      cy.visit('/signin')
      cy.get('.signin.email').type(user.email)
      cy.get('.signin.password').type(user.password)
    })

    it('renders success message', () => {
      cy.get('[type="submit"]').click()
      // TODO: update msg
      cy.contains('signin-success-msg').should('exist')
    })

    it('saves user on localStorage', () => {
      cy.get('[type="submit"]')
        .click()
        .should(() => {
          const localStorageUser = localStorage.getItem('@tsks-user')
          expect(localStorageUser).to.eq(user)
        })
    })

    it('redirects to tsks', () => {
      cy.get('[type="submit"]').click()
      cy.location('pathname').should('eq', '/tsks')
    })
  })

  describe('cannot without email', () => {
    beforeEach(() => {
      cy.visit('/signup')
      cy.get('.signin.password').type(user.password)
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      // TODO: update msg
      cy.contains('wo email error').should('exist')
    })
  })

  describe('cannot without password', () => {
    beforeEach(() => {
      cy.visit('/signup')
      cy.get('.signin.email').type(user.email)
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      // TODO: update msg
      cy.contains('wo password error').should('exist')
    })
  })

  describe('cannot with wrong password', () => {
    const testApiPostRequest = {
      method: 'POST',
      endpoint: '**/v1/signup',
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

      cy.visit('/signup')
      cy.get('.signin-email').type(user.email)
      cy.get('.signin-password').type(user.password)
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      // TODO; update msg
      cy.contains('wrong password error').should('exist')
    })
  })

  describe('cannot with not registered email', () => {
    const testApiPostRequest = {
      method: 'POST',
      endpoint: '**/v1/signup',
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

      cy.visit('/signup')
      cy.get('.signin-email').type(user.email)
      cy.get('.signin-password').type(user.password)
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      // TODO: update msg
      cy.contains('not registered email').should('exist')
    })
  })

  describe('cannot with invalid email', () => {
    beforeEach(() => {
      cy.visit('/signup')
      cy.get('.signin-email').type('invalid email')
      cy.get('.signin-password').type(user.password)
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      // TODO: update msg
      cy.contains('invalid email error').should('exist')
    })
  })
})
