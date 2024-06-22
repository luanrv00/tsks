import user from '../fixtures/user.json'
import invalidUser from '../fixtures/invalid-user.json'
import tsks from '../fixtures/tsks.json'
import tsk from '../fixtures/tsk.json'

// TODO: fix env var not being loaded
const NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY || '@tsks-user'

const NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY || '@tsks-auth-token'

describe('tsks', () => {
  const invalidAuthToken = 'invalid-auth-token'
  const validAuthToken = 'valid-auth-token'

  const testApiGetRequest = {
    method: 'GET',
    endpoint: '**/v1/tsks',
  }

  const testApiGetResponse = {
    statusCode: 200,
    body: {
      ok: true,
      tsks,
    },
  }

  const testApiGetEmptyResponse = {
    statusCode: 200,
    body: {
      ok: true,
      tsks: [],
    },
  }
  describe('POST tsks', () => {
    const testApiPostRequest = {
      method: 'POST',
      endpoint: '**/v1/tsks',
    }

    const testApiPostResponse = {
      statusCode: 201,
      body: {
        ok: true,
        tsk,
      },
    }

    before(() => {
      cy.window().then(window => {
        window.localStorage.setItem(
          NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
          JSON.stringify(user)
        )
      })

      cy.window().then(window => {
        window.localStorage.setItem(
          NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY,
          JSON.stringify(invalidAuthToken)
        )
      })
    })

    after(() => {
      cy.window().then(window =>
        window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
      )

      cy.window().then(window =>
        window.localStorage.removeItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY)
      )
    })

    describe('post succesfully', () => {
      const tskToBeInserted = 'this is a new tsk'
      const ctxToBeInserted = 'this is a context'

      const testApiGetUpdatedResponse = {
        statusCode: 200,
        body: {
          ok: true,
          tsks: [{...tsk, tsk: tskToBeInserted}],
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
            JSON.stringify(validAuthToken)
          )
        })

        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetEmptyResponse
        ).as('fetchEmptyTsks')

        cy.intercept(
          testApiPostRequest.method,
          testApiPostRequest.endpoint,
          testApiPostResponse
        ).as('postTsks')
      })

      afterEach(() => {
        cy.window().then(window =>
          window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
        )

        cy.window().then(window =>
          window.localStorage.removeItem(
            NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY
          )
        )
      })

      it('renders tsk ', () => {
        cy.visit('/tsks')
        cy.wait('@fetchEmptyTsks')
        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetUpdatedResponse
        ).as('fetchUpdatedTsks')
        cy.contains(tskToBeInserted).should('not.exist')
        cy.get('input[placeholder="enter tsk"]').type(tskToBeInserted)
        cy.get('button').click()
        cy.wait('@postTsks')

        cy.wait('@fetchUpdatedTsks')
        cy.contains(tskToBeInserted).should('exist')
      })

      it('clears tsk input', () => {
        cy.visit('/tsks')
        cy.get('input[placeholder="enter tsk"]').type(tskToBeInserted)
        cy.get('button').click()
        cy.get('input[placeholder="enter tsk"]').should('have.value', '')
      })

      it('clears context input', () => {
        cy.visit('/tsks')
        cy.get('input[placeholder="enter tsk"]').type(tskToBeInserted)
        cy.get('input[placeholder="context"]').type(ctxToBeInserted)
        cy.get('button').click()
        cy.get('input[placeholder="context"]').should('have.value', '')
      })
    })
  })
})
