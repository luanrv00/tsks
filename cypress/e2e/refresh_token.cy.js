import getTsksFixture from '../fixtures/api-get-tsks.json'
import postRefreshTokenFixture from '../fixtures/api-post-refresh-token.json'

const NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY || '@tsks-user'

const NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY || '@tsks-auth-token'

describe('requests refresh token', () => {
  describe('when is not valid', () => {
    beforeEach(() => {
      cy.setLocalStorageUser()
      cy.setLocalStorageAuthToken()

      cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
        fixture: 'api-response-401',
      }).as('fetchTsks')

      cy.intercept(
        postRefreshTokenFixture.method,
        postRefreshTokenFixture.endpoint,
        {fixture: 'api-response-400'}
      ).as('requestRefreshToken')

      cy.visit('/tsks')
    })

    after(() => {
      cy.removeLocalStorageUser()
      cy.removeLocalStorageAuthToken()
    })

    it('removes user from localStorage', () => {
      cy.wait('@fetchTsks')
      cy.wait('@requestRefreshToken')
      cy.wait(5000)
      cy.window().then(window => {
        const localStorageUser = window.localStorage.getItem(
          NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY
        )
        expect(localStorageUser).to.not.exist
      })
    })

    it('removes auth token from localStorage', () => {
      cy.wait('@fetchTsks')
      cy.wait('@requestRefreshToken')
      cy.wait(5000)
      cy.window().then(window => {
        const localStorageAuthToken = window.localStorage.getItem(
          NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY
        )
        expect(localStorageAuthToken).to.not.exist
      })
    })

    it('redirects to /signin', () => {
      cy.wait('@fetchTsks')
      cy.wait('@requestRefreshToken')
      cy.wait(5000)
      cy.location('pathname').should('eq', '/signin')
    })
  })

  describe('when is unauthorized', () => {
    beforeEach(() => {
      cy.setLocalStorageUser()
      cy.setLocalStorageAuthToken()

      cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
        fixture: 'api-response-401',
      }).as('fetchTsks')

      cy.intercept(
        postRefreshTokenFixture.method,
        postRefreshTokenFixture.endpoint,
        {fixture: 'api-response-401'}
      ).as('requestRefreshToken')

      cy.visit('/tsks')
    })

    afterEach(() => {
      cy.removeLocalStorageUser()
      cy.removeLocalStorageAuthToken()
    })

    it('removes user from localStorage', () => {
      cy.wait('@fetchTsks')
      cy.wait('@requestRefreshToken')
      cy.wait(5000)
      cy.window().then(window => {
        const localStorageUser = window.localStorage.getItem(
          NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY
        )
        expect(localStorageUser).to.not.exist
      })
    })

    it('removes auth token from localStorage', () => {
      cy.wait('@fetchTsks')
      cy.wait('@requestRefreshToken')
      cy.wait(5000)
      cy.window().then(window => {
        const localStorageAuthToken = window.localStorage.getItem(
          NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY
        )
        expect(localStorageAuthToken).to.not.exist
      })
    })

    it('redirects to /signin', () => {
      cy.wait('@fetchTsks')
      cy.wait('@requestRefreshToken')
      cy.wait(5000)
      cy.location('pathname').should('eq', '/signin')
    })
  })

  describe('when owner is not found', () => {
    beforeEach(() => {
      cy.setLocalStorageUser()
      cy.setLocalStorageAuthToken()

      cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
        fixture: 'api-response-401',
      }).as('fetchTsks')

      cy.intercept(
        postRefreshTokenFixture.method,
        postRefreshTokenFixture.endpoint,
        {fixture: 'api-response-404'}
      ).as('requestRefreshToken')

      cy.visit('/tsks')
    })

    afterEach(() => {
      cy.removeLocalStorageUser()
      cy.removeLocalStorageAuthToken()
    })

    it('removes user from localStorage', () => {
      cy.wait('@fetchTsks')
      cy.wait('@requestRefreshToken')
      cy.wait(5000)
      cy.window().then(window => {
        const localStorageUser = window.localStorage.getItem(
          NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY
        )
        expect(localStorageUser).to.not.exist
      })
    })

    it('removes auth token from localStorage', () => {
      cy.wait('@fetchTsks')
      cy.wait('@requestRefreshToken')
      cy.wait(5000)
      cy.window().then(window => {
        const localStorageAuthToken = window.localStorage.getItem(
          NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY
        )
        expect(localStorageAuthToken).to.not.exist
      })
    })

    it('redirects to /signin', () => {
      cy.wait('@fetchTsks')
      cy.wait('@requestRefreshToken')
      cy.wait(5000)
      cy.location('pathname').should('eq', '/signin')
    })
  })

  describe('when refreshing token', () => {
    beforeEach(() => {
      cy.setLocalStorageUser()
      cy.setLocalStorageAuthToken()

      cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
        fixture: 'api-response-401',
      }).as('fetchTsks')

      cy.intercept(
        postRefreshTokenFixture.method,
        postRefreshTokenFixture.endpoint,
        {fixture: 'api-response-refresh-token-201'}
      ).as('requestRefreshToken')

      cy.visit('/tsks')
    })

    afterEach(() => {
      cy.removeLocalStorageUser()
      cy.removeLocalStorageAuthToken()
    })

    it('calls refresh token api', () => {
      cy.wait('@requestRefreshToken')
    })
  })

  describe('when refreshing token fails', () => {
    beforeEach(() => {
      cy.setLocalStorageUser()
      cy.setLocalStorageAuthToken()

      cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
        fixture: 'api-response-401',
      }).as('fetchTsks')

      cy.intercept(
        postRefreshTokenFixture.method,
        postRefreshTokenFixture.endpoint,
        {forceNetworkError: true}
      ).as('requestRefreshToken')

      cy.visit('/tsks')
    })

    afterEach(() => {
      cy.removeLocalStorageUser()
      cy.removeLocalStorageAuthToken()
    })

    it('redirects to signin', () => {
      cy.location('pathname').should('eq', '/signin')
    })
  })

  describe('refresh token succesfully', () => {
    const renewedAuthToken = 'renewed auth token'

    beforeEach(() => {
      cy.setLocalStorageUser()
      cy.setLocalStorageAuthToken()

      cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
        fixture: 'api-response-401',
      }).as('fetchTsks')

      cy.intercept(
        postRefreshTokenFixture.method,
        postRefreshTokenFixture.endpoint,
        {fixture: 'api-response-refresh-token-201'}
      ).as('requestRefreshToken')

      cy.visit('/tsks')
    })

    afterEach(() => {
      cy.removeLocalStorageUser()
      cy.removeLocalStorageAuthToken()
    })

    it('saves auth token on localStorage', () => {
      cy.wait('@fetchTsks')
      cy.wait('@requestRefreshToken')
      cy.wait(5000)
      cy.window().then(window => {
        const localStorageAuthToken = JSON.parse(
          window.localStorage.getItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY)
        )
        expect(localStorageAuthToken).to.eq(renewedAuthToken)
      })
    })

    it('renders "authentication renewed. please, try again"', () => {
      cy.wait('@fetchTsks')
      cy.wait('@requestRefreshToken')
      cy.contains('authentication renewed. please, try again').should('exist')
    })
  })
})
