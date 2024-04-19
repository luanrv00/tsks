import user from '../fixtures/user.json'
import invalidUser from '../fixtures/invalid-user.json'
import tsks from '../fixtures/tsks.json'

// TODO: fix env var not being loaded
const NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY || '@tsks-user'

describe('tsks', () => {
  const testApiGetRequest = {
    method: 'GET',
    endpoint: '**/v1/tsks',
  }

  describe('cannot without authentication token', () => {
    beforeEach(() => {
      cy.visit('/tsks')
    })

    it('redirects to signin', () => {
      cy.location('pathname').should('eq', '/signin')
    })
  })

  describe('cannot without valid authentication token', () => {
    const testApiGetResponse = {
      statusCode: 401,
      body: {
        ok: false,
        message: '401 Unauthorized',
      },
    }

    before(() => {
      cy.window().then(window => {
        window.localStorage.setItem(
          NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY,
          JSON.stringify(invalidUser)
        )
      })
    })

    after(() => {
      cy.window().then(window => {
        window.localStorage.removeItem(NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY)
      })
    })

    beforeEach(() => {
      cy.intercept(
        testApiGetRequest.method,
        testApiGetRequest.endpoint,
        testApiGetResponse
      )

      cy.visit('/tsks')
    })

    it('redirects to signin', () => {
      cy.location('pathname').should('eq', '/signin')
    })
  })

  // TODO: verify if saving user as session is better than localStorage
  describe('get succesfully', () => {
    describe('when has tsks', () => {
      const testApiGetResponse = {
        statusCode: 200,
        body: {
          ok: true,
          tsks,
        },
      }

      before(() => {
        cy.window().then(window => {
          window.localStorage.setItem(
            NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY,
            JSON.stringify(user)
          )
        })
      })

      after(() => {
        cy.window().then(window =>
          window.localStorage.removeItem(NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY)
        )
      })

      beforeEach(() => {
        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetResponse
        )

        cy.visit('/tsks')
      })

      it('renders each tsk succesfully', () => {
        cy.wait(2000)
        cy.get('[data-testid="tsk"]').should(
          'have.length',
          testApiGetResponse.body.tsks.length
        )
      })
    })

    describe('when has not tsks', () => {
      const testApiGetEmptyResponse = {
        statusCode: 200,
        body: {
          ok: true,
          tsks: [],
        },
      }

      beforeEach(() => {
        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetEmptyResponse
        )

        cy.visit('/tsks')
      })

      it('renders message', () => {
        cy.contains('tsks not found').should('exist')
      })
    })
  })
})
