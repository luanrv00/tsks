describe('SignUp', () => {
  cy.fixture('user').as('user')

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
      cy.get('.signup-password').type(user.password)
    })

    // TODO: verify if saving user as session is better than localStorage
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

  context('cannot without email', () => {
    beforeEach(() => {
      cy.visit('/signup')
      cy.get('.signup-password').type(user.password)
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      // TODO: update msg
      cy.contains('wo email error').should('exist')
    })
  })

  context('cannot without password', () => {
    beforeEach(() => {
      cy.visit('/signup')
      cy.get('.signup.email').type(user.email)
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      // TODO: update msg
      cy.contains('wo password error').should('exist')
    })
  })

  context('cannot without valid email', () => {
    beforeEach(() => {
      cy.visit('/signup')
      cy.get('.signup.email').type('invalid email')
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      // TODO: update msg
      cy.contains('invalid email error').should('exist')
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
      cy.get('.signup-password').type(user.password)
      cy.get('[type="submit"]').click()
    })

    it('renders error message', () => {
      // TODO: update msg
      cy.contains('signup-error-msg').should('exist')
    })
  })
})
