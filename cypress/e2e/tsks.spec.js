import user from '../fixtures/user.json'
import tsks from '../fixtures/tsks.json'

describe('Tsks', () => {
  describe('when has not session', () => {
    beforeEach(() => {
      cy.visit('/tsks')
    })

    it('redirects to signin', () => {
      cy.location('pathname').should('eq', '/signin')
    })
  })

  // TODO: verify if saving user as session is better than localStorage
  describe('when has session', () => {
    describe('list tsks', () => {
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

      describe('when has tsks', () => {
        beforeEach(() => {
          cy.session('session', () => {
            window.localStorage.setItem('@tsks-user', JSON.stringify(user))
          })

          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetResponse
          )

          cy.visit('/tsks')
        })

        it('renders each tsk succesfully', () => {
          cy.wait(2000)
          cy.get('.tsks-item').should(
            'have.length',
            testApiGetResponse.body.tsks.length
          )
        })
      })

      describe('when has not tsks', () => {
        beforeEach(() => {
          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetEmptyResponse
          )

          cy.visit('/tsks')
        })

        it('renders info message', () => {
          cy.contains('No tsks found').should('exist')
        })
      })
    })
  })
})
