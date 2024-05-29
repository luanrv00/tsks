import user from '../fixtures/user.json'

const NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY || '@tsks-user'

const NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY || '@tsks-auth-token'

describe('requests refresh token', () => {
  const invalidAuthToken = 'invalid-auth-token'
  const validAuthToken = 'valid-auth-token'

  const testApiGetRequest = {
    method: 'GET',
    endpoint: '**/v1/tsks',
  }

  const testApiPostRefreshTokenRequest = {
    method: 'POST',
    endpoint: '**/v1/refresh_token',
  }

  describe('when is not valid', () => {
    const testApiGetResponse = {
      statusCode: 401,
      body: {
        ok: false,
        message: '401 Unauthorized',
      },
    }

    const testApiPostRefreshTokenResponse = {
      statusCode: 400,
      body: {
        ok: false,
        message: '400 Bad Request',
      },
    }

    beforeEach(() => {
      cy.window().then(window => {
        window.localStorage.setItem(
          NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
          JSON.stringify(user)
        )
      })

      cy.window().then(window => {
        window.localStorage.setItem(
          NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY,
          invalidAuthToken
        )
      })

      cy.intercept(
        testApiGetRequest.method,
        testApiGetRequest.endpoint,
        testApiGetResponse
      ).as('fetchTsks')

      cy.intercept(
        testApiPostRefreshTokenRequest.method,
        testApiPostRefreshTokenRequest.endpoint,
        testApiPostRefreshTokenResponse
      ).as('requestRefreshToken')

      cy.visit('/tsks')
    })

    afterEach(() => {
      cy.window().then(window => {
        window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
      })

      cy.window().then(window => {
        window.localStorage.removeItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY)
      })
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
    const testApiGetResponse = {
      statusCode: 401,
      body: {
        ok: false,
        message: '401 Unauthorized',
      },
    }

    const testApiPostRefreshTokenResponse = {
      statusCode: 401,
      body: {
        ok: false,
        message: '401 Unauthorized',
      },
    }

    beforeEach(() => {
      cy.window().then(window => {
        window.localStorage.setItem(
          NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
          JSON.stringify(user)
        )
      })

      cy.window().then(window => {
        window.localStorage.setItem(
          NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY,
          invalidAuthToken
        )
      })

      cy.intercept(
        testApiGetRequest.method,
        testApiGetRequest.endpoint,
        testApiGetResponse
      ).as('fetchTsks')

      cy.intercept(
        testApiPostRefreshTokenRequest.method,
        testApiPostRefreshTokenRequest.endpoint,
        testApiPostRefreshTokenResponse
      ).as('requestRefreshToken')

      cy.visit('/tsks')
    })

    afterEach(() => {
      cy.window().then(window => {
        window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
      })

      cy.window().then(window => {
        window.localStorage.removeItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY)
      })
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

  describe('refresh token succesfully', () => {
    const renewedAuthToken = 'renewed auth token'

    const testApiGetResponse = {
      statusCode: 401,
      body: {
        ok: false,
        message: '401 Unauthorized',
      },
    }

    const testApiPostRefreshTokenResponse = {
      statusCode: 201,
      body: {
        ok: true,
        message: '201 Created',
        auth_token: renewedAuthToken
      },
    }

    beforeEach(() => {
      cy.window().then(window => {
        window.localStorage.setItem(
          NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
          JSON.stringify(user)
        )
      })

      cy.window().then(window => {
        window.localStorage.setItem(
          NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY,
          validAuthToken
        )
      })

      cy.intercept(
        testApiGetRequest.method,
        testApiGetRequest.endpoint,
        testApiGetResponse
      ).as('fetchTsks')

      cy.intercept(
        testApiPostRefreshTokenRequest.method,
        testApiPostRefreshTokenRequest.endpoint,
        testApiPostRefreshTokenResponse
      ).as('requestRefreshToken')

      cy.visit('/tsks')
    })

    afterEach(() => {
      cy.window().then(window => {
        window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
      })

      cy.window().then(window => {
        window.localStorage.removeItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY)
      })
    })

    it('saves auth token on localStorage', () => {
      cy.wait('@fetchTsks')
      cy.wait('@requestRefreshToken')
      cy.wait(5000)
      cy.window().then(window => {
        const localStorageAuthToken = window.localStorage.getItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY)
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
