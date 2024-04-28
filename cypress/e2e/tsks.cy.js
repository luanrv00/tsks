import user from '../fixtures/user.json'
import invalidUser from '../fixtures/invalid-user.json'
import tsks from '../fixtures/tsks.json'
import tsk from '../fixtures/tsk.json'

// TODO: fix env var not being loaded
const NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY || '@tsks-user'

describe('tsks', () => {
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

  describe('cannot access without authentication token', () => {
    beforeEach(() => {
      cy.visit('/tsks')
    })

    it('redirects to signin', () => {
      cy.location('pathname').should('eq', '/signin')
    })
  })

  describe('cannot access without valid authentication token', () => {
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

  describe('GET tsks', () => {
    // TODO: verify if saving user as session is better than localStorage
    describe('get succesfully', () => {
      describe('when has tsks', () => {
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

      // TODO: verify why this suites works even without localStorage preset
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

    describe('cannot without tsk', () => {
      beforeEach(() => {
        cy.visit('/tsks')
        cy.get('button').click()
      })

      it('renders error message', () => {
        cy.contains('cannot without tsk').should('exist')
      })
    })
      
    describe('post succesfully', () => {
      beforeEach(() => {
        cy.intercept(
          testApiPostRequest.method,
          testApiPostRequest.endpoint,
          testApiPostResponse
        )

        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetResponse
        )

        cy.visit('/tsks')
        cy.get('input[placeholder="enter tsk"]').type(tsks[0].tsk)
        cy.get('button').click()
      })

      it('renders tsk ', () => {
        cy.contains(tsks[0].tsk).should('exist')
      })
    })
  })

  describe('PUT tsk', () => {
    const testApiPutRequest = {
      method: 'PUT',
      endpoint: '**/v1/tsks/*',
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

    describe('cannot unexistent tsk', () => {
      const testApiPutResponse = {
        statusCode: 404,
        body: {
          ok: false,
          message: '404 Not Found',
        },
      }

      beforeEach(() => {
        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetResponse
        )

        cy.intercept(
          testApiPutRequest.method,
          testApiPutRequest.endpoint,
          testApiPutResponse
        )

        cy.visit('/tsks')
        cy.get('[data-testid="tsk"').first().click()
      })

      it('renders error message', () => {
        cy.contains('404 Not Found').should('exist')
      })
    })

    describe('put succesfully', () => {
      describe('put doing tsk', () => {
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

        const testApiGetResponse = {
          statusCode: 200,
          body: {
            ok: true,
            tsks: [tsk]
          }
        }

        const updatedTsk = {...tsk, status: 'doing'}

        const testApiPutResponse = {
          statusCode: 200,
          body: {
            ok: true,
            tsk: updatedTsk
          }
        }

        const testApiGetUpdatedResponse = {
          statusCode: 200,
          body: {
            ok: true,
            tsks: [updatedTsk]
          }
        }

        beforeEach(() => {
          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetResponse
          )

          cy.intercept(
            testApiPutRequest.method,
            testApiPutRequest.endpoint,
            testApiPutResponse
          )
          
          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetUpdatedResponse
          )

          cy.visit('/tsks')
          cy.wait(2000)
          cy.get('[data-testid="tsk"]').click()
        })

        it('renders tsk', () => {
          cy.contains('+').should('exist')
          cy.contains(updatedTsk.tsk).should('exist')
        })
      })

      describe('put done tsk', () => {
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

        const tskDoing = {...tsk, status: 'doing'}

        const testApiGetResponse = {
          statusCode: 200,
          body: {
            ok: true,
            tsks: [tskDoing]
          }
        }

        const updatedTsk = {...tsk, status: 'done'}

        const testApiPutResponse = {
          statusCode: 200,
          body: {
            ok: true,
            tsk: updatedTsk
          }
        }

        const testApiGetUpdatedResponse = {
          statusCode: 200,
          body: {
            ok: true,
            tsks: [updatedTsk]
          }
        }

        beforeEach(() => {
          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetResponse
          )

          cy.intercept(
            testApiPutRequest.method,
            testApiPutRequest.endpoint,
            testApiPutResponse
          )
          
          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetUpdatedResponse
          )

          cy.visit('/tsks')
          cy.wait(2000)
          cy.get('[data-testid="tsk"]').click()
        })

        it('renders tsk', () => {
          cy.contains('*').should('exist')
          cy.contains(updatedTsk.tsk).should('exist')
        })
      })

      // TODO: write tests and implementation
      describe('put tsk content', () => {
      })
    })
  })

  describe('renders tsk', () => {
    beforeEach(() => {
      cy.window().then(window => {
        window.localStorage.setItem(
          NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY,
          JSON.stringify(user)
        )
      })

      cy.intercept(
        testApiGetRequest.method,
        testApiGetRequest.endpoint,
        testApiGetResponse
      )

      cy.visit('/tsks')
    })

    afterEach(() => {
      cy.window().then(window => 
        window.localStorage.removeItem(NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY)
      )
    })

    it('renders tsk', () => {
      cy.contains(testApiGetResponse.body.tsks[0].tsk).should('exist')
    })

    it('renders context', () => {
      cy.contains(`@${testApiGetResponse.body.tsks[0].context}`).should('exist')
    })

    describe('renders status', () => {
      describe('when todo', () => {
        beforeEach(() => {
          cy.window().then(window => {
            window.localStorage.setItem(
              NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY,
              JSON.stringify(user)
            )
          })

          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetResponse
          )

          cy.visit('/tsks')
        })

        afterEach(() => {
          cy.window().then(window => 
            window.localStorage.removeItem(NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY)
          )
        })

        it('renders "-"', () => {
          cy.contains('-').should('exist')
        })
      })

      describe('when doing', () => {
        const testApiGetResponse = {
          statusCode: 200,
          body: {
            ok: true,
            tsks: [{...tsk, status: 'doing'}]
          }
        }

        beforeEach(() => {
          cy.window().then(window => {
            window.localStorage.setItem(
              NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY,
              JSON.stringify(user)
            )
          })

          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetResponse
          )

          cy.visit('/tsks')
        })

        afterEach(() => {
          cy.window().then(window => 
            window.localStorage.removeItem(NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY)
          )
        })

        it('renders "+"', () => {
          cy.contains('+').should('exist')
        })
      })

      describe('when done', () => {
        const testApiGetResponse = {
          statusCode: 200,
          body: {
            ok: true,
            tsks: [{...tsk, status: 'done'}]
          }
        }

        beforeEach(() => {
          cy.window().then(window => {
            window.localStorage.setItem(
              NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY,
              JSON.stringify(user)
            )
          })

          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetResponse
          )

          cy.visit('/tsks')
        })

        afterEach(() => {
          cy.window().then(window => 
            window.localStorage.removeItem(NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY)
          )
        })
        it('renders "*"', () => {
          cy.contains('*').should('exist')
        })
      })
    })
  })
})
