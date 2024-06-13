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

  describe('cannot access without authentication token', () => {
    beforeEach(() => {
      cy.visit('/tsks')
    })

    it('redirects to signin', () => {
      cy.location('pathname').should('eq', '/signin')
    })
  })

  describe('cannot access without valid authentication token', () => {
    describe('when auth token is unauthorized', () => {
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
            NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
            JSON.stringify(invalidUser)
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
        cy.window().then(window => {
          window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
        })

        cy.window().then(window => {
          window.localStorage.removeItem(
            NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY
          )
        })
      })

      beforeEach(() => {
        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetResponse
        )
      })

      it('requests refresh token', () => {
        cy.intercept('POST', '**/v1/refresh_token').as('refreshToken')
        cy.visit('/tsks')
        cy.wait('@refreshToken')
        cy.get('@refreshToken.all').should('have.length.least', 1)
      })
    })

    describe('when auth token is forbidden', () => {
      const testApiGetResponse = {
        statusCode: 403,
        body: {
          ok: false,
          message: '403 Forbidden',
        },
      }

      before(() => {
        cy.window().then(window => {
          window.localStorage.setItem(
            NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
            JSON.stringify(invalidUser)
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
        cy.window().then(window => {
          window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
        })

        cy.window().then(window => {
          window.localStorage.removeItem(
            NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY
          )
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

      it('removes user from localStorage', () => {
        cy.visit('/tsks')
        cy.wait(5000)
        cy.window().then(window => {
          const localStorageUser = JSON.parse(
            window.localStorage.getItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
          )

          expect(localStorageUser).to.eq(null)
        })
      })

      it('removes auth token from localStorage', () => {
        cy.visit('/tsks')
        cy.wait(5000)
        cy.window().then(window => {
          const localStorageAuthToken = window.localStorage.getItem(
            NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY
          )
          expect(localStorageAuthToken).to.not.exist
        })
      })
    })
  })

  describe('GET tsks', () => {
    // TODO: verify if saving user as session is better than localStorage
    describe('get succesfully', () => {
      describe('when has tsks', () => {
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
              JSON.stringify(validAuthToken)
            )
          })
        })

        after(() => {
          cy.window().then(window =>
            window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
          )

          cy.window().then(window =>
            window.localStorage.removeItem(
              NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY
            )
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
      const tskToBeInserted = 'this is a new tsk'

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
        cy.contains(tskToBeInserted).should('not.exist')
        cy.get('input[placeholder="enter tsk"]').type(tskToBeInserted)
        cy.get('button').click()
        cy.wait('@postTsks')
        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetUpdatedResponse
        ).as('fetchUpdatedTsks')
        cy.wait('@fetchUpdatedTsks')
        cy.contains(tskToBeInserted).should('exist')
      })

      it('clears input', () => {
        cy.visit('/tsks')
        cy.get('input[placeholder="enter tsk"]').type(tskToBeInserted)
        cy.get('button').click()
        cy.get('input[placeholder="enter tsk"]').should('have.value', '')
      })
    })

    describe('when auth token is unauthorized', () => {
      const testApiPostResponse = {
        statusCode: 401,
        body: {
          ok: false,
          message: '401 Unauthorized',
        },
      }

      before(() => {
        cy.window().then(window => {
          window.localStorage.setItem(
            NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
            JSON.stringify(invalidUser)
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
        cy.window().then(window => {
          window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
        })

        cy.window().then(window => {
          window.localStorage.removeItem(
            NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY
          )
        })
      })

      beforeEach(() => {
        cy.intercept(
          testApiPostRequest.method,
          testApiPostRequest.endpoint,
          testApiPostResponse
        ).as('postTsks')
      })

      it('requests refresh token', () => {
        cy.intercept('POST', '**/v1/refresh_token').as('refreshToken')
        cy.visit('/tsks')
        cy.get('input[placeholder="enter tsk"]').type('tmp tsk')
        cy.get('button').click()
        cy.wait('@postTsks')
        cy.wait('@refreshToken')
        cy.get('@refreshToken.all').should('have.length.least', 1)
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
    })

    after(() => {
      cy.window().then(window =>
        window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
      )

      cy.window().then(window =>
        window.localStorage.removeItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY)
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
        ).as('putTsk')

        cy.visit('/tsks')
        cy.get('[data-testid="tsk"').first().click()
      })

      it('renders error message', () => {
        cy.wait('@putTsk')
        cy.contains('404 Not Found').should('exist')
      })
    })

    describe('put succesfully', () => {
      describe('put doing tsk', () => {
        before(() => {
          cy.window().then(window => {
            window.localStorage.setItem(
              NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
              JSON.stringify(user)
            )
          })
        })

        after(() => {
          cy.window().then(window =>
            window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
          )
        })

        const testApiGetResponse = {
          statusCode: 200,
          body: {
            ok: true,
            tsks: [tsk],
          },
        }

        const updatedTsk = {...tsk, status: 'doing'}

        const testApiPutResponse = {
          statusCode: 200,
          body: {
            ok: true,
            tsk: updatedTsk,
          },
        }

        const testApiGetUpdatedResponse = {
          statusCode: 200,
          body: {
            ok: true,
            tsks: [updatedTsk],
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

          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetUpdatedResponse
          )

          cy.visit('/tsks')
        })

        it('renders tsk', () => {
          cy.contains('+').should('not.exist')
          cy.get('[data-testid="tsk"]').click()
          cy.contains('+').should('exist')
          cy.contains(updatedTsk.tsk).should('exist')
        })
      })

      describe('put done tsk', () => {
        before(() => {
          cy.window().then(window => {
            window.localStorage.setItem(
              NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
              JSON.stringify(user)
            )
          })
        })

        after(() => {
          cy.window().then(window =>
            window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
          )
        })

        const tskDoing = {...tsk, status: 'doing'}

        const testApiGetResponse = {
          statusCode: 200,
          body: {
            ok: true,
            tsks: [tskDoing],
          },
        }

        const updatedTsk = {...tsk, status: 'done'}

        const testApiPutResponse = {
          statusCode: 200,
          body: {
            ok: true,
            tsk: updatedTsk,
          },
        }

        const testApiGetUpdatedResponse = {
          statusCode: 200,
          body: {
            ok: true,
            tsks: [updatedTsk],
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

          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetUpdatedResponse
          )

          cy.visit('/tsks')
        })

        it('renders tsk', () => {
          cy.contains('*').should('not.exist')
          cy.get('[data-testid="tsk"]').click()
          cy.contains('*').should('exist')
          cy.contains(updatedTsk.tsk).should('exist')
        })
      })

      // TODO: write tests and implementation
      describe('put tsk content', () => {})
    })

    describe('when auth token is unauthorized', () => {
      const testApiPutResponse = {
        statusCode: 401,
        body: {
          ok: false,
          message: '401 Unauthorized',
        },
      }

      before(() => {
        cy.window().then(window => {
          window.localStorage.setItem(
            NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
            JSON.stringify(invalidUser)
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
        cy.window().then(window => {
          window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
        })

        cy.window().then(window => {
          window.localStorage.removeItem(
            NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY
          )
        })
      })

      beforeEach(() => {
        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetResponse
        ).as('getTsks')

        cy.intercept(
          testApiPutRequest.method,
          testApiPutRequest.endpoint,
          testApiPutResponse
        ).as('putTsk')
      })

      it('requests refresh token', () => {
        cy.intercept('POST', '**/v1/refresh_token').as('refreshToken')
        cy.visit('/tsks')
        cy.wait('@getTsks')
        cy.get('[data-testid="tsk"]').first().click()
        cy.wait('@putTsk')
        cy.wait('@refreshToken')
        cy.get('@refreshToken.all').should('have.length.least', 1)
      })
    })
  })

  describe('DELETE tsk', () => {
    const tskToBeDeleted = 'this tsk must be removed'

    const testApiDeleteRequest = {
      method: 'DELETE',
      endpoint: '**/v1/tsks/*',
    }

    const testApiDeleteResponse = {
      statusCode: 200,
      body: {
        ok: true,
      },
    }

    const testApiGetTwoTsksResponse = {
      statusCode: 200,
      body: {
        ok: true,
        tsks: [tsk, {...tsk, tsk: tskToBeDeleted}],
      },
    }

    describe('delete succesfully', () => {
      const testApiGetOneTskResponse = {
        statusCode: 200,
        body: {
          ok: true,
          tsks: [tsk],
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
          testApiGetTwoTsksResponse
        ).as('fetchTsks')

        cy.intercept(
          testApiDeleteRequest.method,
          testApiDeleteRequest.endpoint,
          testApiDeleteResponse
        ).as('deleteTsk')

        cy.visit('/tsks')
        cy.wait('@fetchTsks')
      })

      afterEach(() => {
        cy.window(window => {
          window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
        })

        cy.window(window => {
          window.localStorage.removeItem(
            NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY
          )
        })
      })

      it('renders "deleted succesfully"', () => {
        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetOneTskResponse
        ).as('fetchTsksAfterDeletion')
        cy.get('[data-testid="tsk"]')
          .contains(tskToBeDeleted)
          .parents('li')
          .within(() => {
            cy.contains('delete').click()
          })
        cy.wait('@deleteTsk')
        cy.wait('@fetchTsksAfterDeletion')
        cy.contains('deleted succesfully').should('exist')
      })

      it('remove tsk from render', () => {
        cy.contains(tskToBeDeleted).should('exist')
        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetOneTskResponse
        ).as('fetchTsksAfterDeletion')
        cy.get('[data-testid="tsk"]')
          .contains(tskToBeDeleted)
          .parents('li')
          .within(() => {
            cy.contains('delete').click()
          })
        cy.wait('@deleteTsk')
        cy.wait('@fetchTsksAfterDeletion')
        cy.contains(tskToBeDeleted).should('not.exist')
      })
    })

    describe('when auth token is unauthorized', () => {
      const testApiDeleteResponse = {
        statusCode: 401,
        body: {
          ok: false,
          message: '401 Unauthorized',
        },
      }

      before(() => {
        cy.window().then(window => {
          window.localStorage.setItem(
            NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
            JSON.stringify(invalidUser)
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
        cy.window().then(window => {
          window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
        })

        cy.window().then(window => {
          window.localStorage.removeItem(
            NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY
          )
        })
      })

      beforeEach(() => {
        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetTwoTsksResponse
        ).as('getTsks')

        cy.intercept(
          testApiDeleteRequest.method,
          testApiDeleteRequest.endpoint,
          testApiDeleteResponse
        ).as('deleteTsk')
      })

      it('requests refresh token', () => {
        cy.intercept('POST', '**/v1/refresh_token').as('refreshToken')
        cy.visit('/tsks')
        cy.wait('@getTsks')
        cy.get('[data-testid="tsk"]')
          .contains(tskToBeDeleted)
          .parents('li')
          .within(() => {
            cy.contains('delete').click()
          })
        cy.wait('@deleteTsk')
        cy.wait('@refreshToken')
        cy.get('@refreshToken.all').should('have.length.least', 1)
      })
    })
  })

  describe('renders tsk', () => {
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
        testApiGetResponse
      )

      cy.visit('/tsks')
    })

    afterEach(() => {
      cy.window().then(window =>
        window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
      )

      cy.window().then(window =>
        window.localStorage.removeItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY)
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
              NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
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
            window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
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
            tsks: [{...tsk, status: 'doing'}],
          },
        }

        beforeEach(() => {
          cy.window().then(window => {
            window.localStorage.setItem(
              NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
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
            window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
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
            tsks: [{...tsk, status: 'done'}],
          },
        }

        beforeEach(() => {
          cy.window().then(window => {
            window.localStorage.setItem(
              NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
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
            window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
          )
        })
        it('renders "*"', () => {
          cy.contains('*').should('exist')
        })
      })
    })
  })
})
