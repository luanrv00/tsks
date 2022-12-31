describe('Tsks', () => {
  // TODO: implement private route
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
    cy.fixture('user').as('user')

    beforeEach(() => {
      localStorage.setItem('@tsks-user', user)
    })

    describe('list tsks', () => {
      cy.fixture('tsks').as('tsks')

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
          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetResponse
          )

          cy.visit('/tsks')
        })

        it.each(testApiGetResponse.body.tsks)('renders succesfully', tsk => {
          cy.contains(tsk.tsk).should('exist')
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
          cy.contains('No tsks found.').should('exist')
        })
      })
    })

    describe('create tsk', () => {
      describe('creates succesfully', () => {
        cy.fixture('tsk').as('tsk')

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

        beforeEach(() => {
          cy.intercept(
            testApiPostRequest.method,
            testApiPostRequest.endpoint,
            testApiPostResponse
          )

          cy.visit('/tsks')
          cy.get('[placeholder="add new tsk"]').type(tsk.tsk)
          cy.get('[type="submit"]').click()
        })

        it('renders tsk', () => {
          cy.contains(testTsk.tsk.tsk).should('exist')
        })
      })

      describe('cannot without required params', () => {
        beforeEach(() => {
          cy.get('[type="submit"]').click()
        })

        it('renders error message', () => {
          // TODO: update error msg
          cy.contains('tsk input is empty error')
        })
      })
    })

    describe('delete tsk', () => {
      cy.fixture('tsks').as('tsks')

      const testApiGetRequest = {
        method: 'GET',
        endpoint: '**/v1/tsks',
      }

      const testApiDeleteRequest = {
        method: 'DELETE',
        endpoint: '**/v1/tsks/*',
      }

      const testApiGetResponse = {
        statusCode: 204,
        body: {
          ok: true,
          tsks,
        },
      }

      const testApiDeleteResponse = {
        statusCode: 204,
      }

      beforeEach(() => {
        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetResponse
        )

        cy.intercept(
          testApiDeleteRequest.method,
          testApiDeleteRequest.endpoint,
          testApiDeleteResponse
        )

        cy.visit('/tsks')
        cy.contains(testApiGetResponse.body.tsks[0].tsk).within(() => {
          cy.get('.tsk-delete').click() // TODO: check class name on component
        })
      })

      describe('deletes succesfully', () => {
        it('removes tsk', () => {
          cy.contains(testApiOkResponse.body.tsks[0].tsk).should('not', 'exist')
        })

        it('renders success msg', () => {
          // TODO: update msg
          cy.contains('deleted succesfully msg').should('exist')
        })
      })
    })
  })
})
