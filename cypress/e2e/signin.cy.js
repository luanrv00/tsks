import user from '../fixtures/user.json'

// TODO: fix env var not being loaded
const NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY || '@tsks-user'

const NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY || '@tsks-auth-token'

describe('signin', () => {
  const testApiPostRequest = {
    method: 'POST',
    endpoint: '**/v1/signin',
  }

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
      cy.get('input[placeholder="user@tsks.app"]').type(user.email)
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
      cy.get('input[placeholder="user@tsks.app"]').type(user.email)
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('required').should('exist')
    })
  })

  describe('cannot without correct password', () => {
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
      cy.get('input[placeholder="user@tsks.app"]').type(user.email)
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('401 Unauthorized').should('exist')
    })
  })

  describe('signin succesfully', () => {
    const authToken = 'auth-token'

    const testApiPostResponse = {
      statusCode: 201,
      body: {
        ok: true,
        user,
        auth_token: authToken
      },
    }

    beforeEach(() => {
      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signin')
      cy.get('input[placeholder="user@tsks.app"]').type(user.email)
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('saves user on localStorage', () => {
      cy.wait(2000)
      cy.window().then(window => {
        const localStorageUser = JSON.parse(
          window.localStorage.getItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
        )
        expect(localStorageUser).to.deep.eq(user)
      })
    })

    it('saves auth token on localStorage', () => {
      cy.wait(2000)
      cy.window().then(window => {
        const localStorageAuthToken = window.localStorage.getItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY)
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
