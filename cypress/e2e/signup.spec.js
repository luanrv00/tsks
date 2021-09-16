describe('SignUp', () => {
  it('registers an e-mail', () => {
    cy.intercept('POST', '**/v1/register', {
      statusCode: 201,
      body: {
        ok: true
      }
    })

    cy.visit('/signup')
    cy.get('[placeholder="user@tsks.app"]').type('test@tsks.mail')
    cy.get('[placeholder="******"]').type('testpass')
    cy.get('[type="submit"]').click()
    cy.get('[data-signup-error]').should('not.exist')
  })

  it('redirects to tsks list after registering an e-mail', () => {
    cy.intercept('POST', '**/v1/register', {
      statusCode: 201,
      body: {
        ok: true
      }
    })

    cy.visit('/signup')
    cy.get('[placeholder="user@tsks.app"]').type('test@tsks.mail')
    cy.get('[placeholder="******"]').type('testpass')
    cy.get('[type="submit"]').click()
    cy.location('pathname').should('eq', '/tsks')
  })

  it('renders an error for already registered e-mail', () => {
    cy.intercept('POST', '**/v1/register', {
      statusCode: 409,
      body: {
        ok: false,
        message: 'E-mail already registered'
      }
    })

    cy.visit('/signup')
    cy.get('[placeholder="user@tsks.app"]').type('test@tsks.mail')
    cy.get('[placeholder="******"]').type('testpass')
    cy.get('[type="submit"]').click()
    cy.get('.error').should('exist')
    cy.get('.error').should('have.text', 'E-mail already registered')
  })

  it('renders an error for missing network connection', () => {
    cy.intercept('POST', '**/v1/register', {
      statusCode: 409,
      body: {
        ok: false,
        message: 'NetworkError when attempting to fetch resource'
      }
    })

    cy.visit('/signup')
    cy.get('[placeholder="user@tsks.app"]').type('test@tsks.mail')
    cy.get('[placeholder="******"]').type('testpass')
    cy.get('[type="submit"]').click()
    cy.get('.error').should('exist')
    cy.get('.error').should('have.text', 'NetworkError when attempting to fetch resource')
  })

  it('stores user\'s token on browser\'s local storage', () => {
    cy.intercept('POST', '**/v1/register', {
      statusCode: 201,
      body: {
        ok: true,
        token: 'token'
      }
    })

    cy.visit('/signup')
    cy.get('[placeholder="user@tsks.app"]').type('test@tsks.mail')
    cy.get('[placeholder="******"]').type('testpass')
    cy.get('[type="submit"]').click().should(() => {
      const localStorageData = localStorage.getItem('@tsks-token')
      expect(localStorageData).to.eq('token')
    })
  })
})
