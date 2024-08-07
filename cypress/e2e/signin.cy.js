import userFixture from '../fixtures/user.json'
import postSigninFixture from '../fixtures/api-post-signin.json'

// TODO: fix env var not being loaded
const NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY || '@tsks-user'

const NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY || '@tsks-auth-token'

describe('signin', () => {
  describe('cannot without email', () => {
    beforeEach(() => {
      cy.visit('/signin')
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('required').should('exist')
    })
  })

  describe('cannot without valid email', () => {
    beforeEach(() => {
      cy.visit('/signin')
      cy.get('input[placeholder="user@tsks.app"]').type('invalid email')
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('invalid email').should('exist')
    })
  })

  describe('cannot without registered email', () => {
    beforeEach(() => {
      cy.intercept(postSigninFixture.method, postSigninFixture.endpoint, {
        fixture: 'api-response-404',
      })

      cy.visit('/signin')
      cy.get('input[placeholder="user@tsks.app"]').type('unregistered@mail.com')
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('404 Not Found').should('exist')
    })
  })

  describe('cannot without password', () => {
    beforeEach(() => {
      cy.visit('/signin')
      cy.get('input[placeholder="user@tsks.app"]').type('registered@mail.com')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('required').should('exist')
    })
  })

  describe('cannot without correct password', () => {
    beforeEach(() => {
      cy.intercept(postSigninFixture.method, postSigninFixture.endpoint, {
        fixture: 'api-response-401',
      })

      cy.visit('/signin')
      cy.get('input[placeholder="user@tsks.app"]').type('registered@mail.com')
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('401 Unauthorized').should('exist')
    })
  })

  context('when signing in', () => {
    beforeEach(() => {
      cy.intercept(postSigninFixture.method, postSigninFixture.endpoint, () =>
        Promise.resolve({json: () => ({})})
      ).as('signin')

      cy.visit('/signin')
      cy.get('input[placeholder="user@tsks.app"]').type('registered@mail.com')
      cy.get('input[placeholder="******"]').type('123')
    })

    it('renders loading button', () => {
      cy.get('button').click()
      cy.get('button').should('have.class', 'loading')
    })

    it('calls signin api', () => {
      cy.get('button').click()
      cy.wait('@signin')
    })
  })

  context('when signing in fails', () => {
    beforeEach(() => {
      cy.intercept(postSigninFixture.method, postSigninFixture.endpoint, {
        forceNetworkError: true,
      })

      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type('registered@mail.com')
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('Failed to fetch').should('exist')
    })

    it('not renders loading button', () => {
      cy.get('button').should('not.have.class', 'loading')
    })
  })

  describe('signin succesfully', () => {
    beforeEach(() => {
      cy.intercept(postSigninFixture.method, postSigninFixture.endpoint, {
        fixture: 'api-response-user-201',
      })

      cy.visit('/signin')
      cy.get('input[placeholder="user@tsks.app"]').type(userFixture.email)
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    afterEach(() => {
      cy.removeLocalStorageUser()
      cy.removeLocalStorageAuthToken()
    })

    it('saves user on localStorage', () => {
      cy.wait(2000)
      cy.window().then(window => {
        const localStorageUser = JSON.parse(
          window.localStorage.getItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
        )
        expect(localStorageUser).to.deep.eq(userFixture)
      })
    })

    it('saves auth token on localStorage', () => {
      cy.wait(2000)
      cy.window().then(window => {
        const localStorageAuthToken = window.localStorage.getItem(
          NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY
        )
        expect(localStorageAuthToken).to.exist
      })
    })

    it('redirects to tsks', () => {
      cy.location('pathname').should('eq', '/tsks')
    })
  })

  describe('renders a link to signup', () => {
    beforeEach(() => {
      cy.visit('/signin')
    })

    it('renders a link to signup', () => {
      cy.contains('or signup a new account').should('exist')
    })

    it('redirects to signup when clicking', () => {
      cy.location('pathname').should('eq', '/signin')
      cy.contains('or signup a new account').click()
      cy.location('pathname').should('eq', '/signup')
    })
  })
})
