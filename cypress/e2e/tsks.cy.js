import user from '../fixtures/user.json'
import tsks from '../fixtures/tsks.json'
import tsk from '../fixtures/tsk.json'

// TODO: fix env var not being loaded
const NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY || '@tsks-user'

const NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY || '@tsks-auth-token'

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
        cy.setLocalStorageInvalidUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
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
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
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

  describe('access succesfully', () => {
    before(() => {
      cy.setLocalStorageUser()
      cy.setLocalStorageAuthToken()
    })

    after(() => {
      cy.removeLocalStorageUser()
      cy.removeLocalStorageAuthToken()
    })

    beforeEach(() => {
      cy.intercept(testApiGetRequest.method, testApiGetRequest.endpoint, () =>
        Promise.resolve({json: () => testApiGetResponse})
      )

      cy.visit('/tsks')
    })

    it('renders user email', () => {
      cy.contains(user.email).should('exist')
    })
  })

  describe('GET tsks', () => {
    describe('get succesfully', () => {
      describe('when has tsks', () => {
        before(() => {
          cy.setLocalStorageUser()
          cy.setLocalStorageAuthToken()
        })

        after(() => {
          cy.removeLocalStorageUser()
          cy.removeLocalStorageAuthToken()
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
        before(() => {
          cy.setLocalStorageUser()
          cy.setLocalStorageAuthToken()
        })

        after(() => {
          cy.removeLocalStorageUser()
          cy.removeLocalStorageAuthToken()
        })

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

    describe('when getting', () => {
      beforeEach(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()

        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetResponse
        ).as('getTsks')

        cy.visit('/tsks')
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

      it('renders loading', () => {
        cy.get('.loading-icon').should('exist')
      })

      it('calls get api', () => {
        cy.wait('@getTsks')
      })
    })

    context('when getting fails', () => {
      before(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

      beforeEach(() => {
        cy.intercept(testApiGetRequest.method, testApiGetRequest.endpoint, {
          forceNetworkError: true,
        })

        cy.visit('/tsks')
      })

      it('renders error message', () => {
        cy.contains('Failed to fetch').should('exist')
      })

      it('not renders loading', () => {
        cy.get('.loading-icon').should('not.exist')
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

    describe('cannot without tsk', () => {
      before(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

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
      const ctxToBeInserted = 'this is a context'

      const testApiGetUpdatedResponse = {
        statusCode: 200,
        body: {
          ok: true,
          tsks: [{...tsk, tsk: tskToBeInserted}],
        },
      }

      beforeEach(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()

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

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
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

    describe('when auth token is unauthorized', () => {
      const testApiPostResponse = {
        statusCode: 401,
        body: {
          ok: false,
          message: '401 Unauthorized',
        },
      }

      before(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
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

    describe('when posting', () => {
      beforeEach(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()

        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetEmptyResponse
        ).as('fetchEmptyTsks')

        cy.intercept(testApiPostRequest.method, testApiPostRequest.endpoint, {
          delay: 5000,
        }).as('postTsk')

        cy.visit('/tsks')
        cy.wait('@fetchEmptyTsks')
        cy.get('input[placeholder="enter tsk"]').type('t')
        cy.get('button').click()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

      it('renders loading', () => {
        cy.get('button').should('have.class', 'loading')
      })

      it('calls post api', () => {
        cy.wait('@postTsk')
      })
    })

    context('when posting fails', () => {
      before(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

      beforeEach(() => {
        cy.intercept(testApiPostRequest.method, testApiPostRequest.endpoint, {
          forceNetworkError: true,
        })

        cy.visit('/tsks')
        cy.get('input[placeholder="enter tsk"]').type('t')
        cy.get('button').click()
      })

      it('renders error message', () => {
        cy.contains('Failed to fetch').should('exist')
      })

      it('not renders loading button', () => {
        cy.get('button').should('not.have.class', 'loading')
      })
    })
  })

  describe('PUT tsk', () => {
    const testApiPutRequest = {
      method: 'PUT',
      endpoint: '**/v1/tsks/*',
    }

    describe('cannot unexistent tsk', () => {
      const testApiPutResponse = {
        statusCode: 404,
        body: {
          ok: false,
          message: '404 Not Found',
        },
      }

      before(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

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

        before(() => {
          cy.setLocalStorageUser()
          cy.setLocalStorageAuthToken()
        })

        after(() => {
          cy.removeLocalStorageUser()
          cy.removeLocalStorageAuthToken()
        })

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

        before(() => {
          cy.setLocalStorageUser()
          cy.setLocalStorageAuthToken()
        })

        after(() => {
          cy.removeLocalStorageUser()
          cy.removeLocalStorageAuthToken()
        })

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
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
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
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()

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

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
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
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
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

    describe('when deleting', () => {
      const testApiPutRequest = {
        method: 'PUT',
        endpoint: '**/v1/tsks/*',
      }

      const testApiPutResponse = {
        statusCode: 200,
        body: {
          ok: true,
          body: tsk,
        },
      }

      beforeEach(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()

        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetTwoTsksResponse
        ).as('fetchTsks')

        cy.intercept(
          testApiDeleteRequest.method,
          testApiDeleteRequest.endpoint,
          {delay: 5000}
        ).as('deleteTsk')

        cy.intercept(
          testApiPutRequest.method,
          testApiPutRequest.endpoint,
          testApiPutResponse
        )

        cy.visit('/tsks')
        cy.wait('@fetchTsks')
        cy.get('[data-testid="tsk"]')
          .contains(tskToBeDeleted)
          .parents('li')
          .within(() => {
            cy.contains('delete').click()
          })
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

      it('renders loading', () => {
        cy.get('[data-testid="tsk"]')
          .contains(tskToBeDeleted)
          .parents('li')
          .within(() => {
            cy.get('button').should('have.class', 'loading')
          })
      })

      it('calls delete api', () => {
        cy.wait('@deleteTsk')
      })
    })

    context('when deleting fails', () => {
      const testApiPutRequest = {
        method: 'PUT',
        endpoint: '**/v1/tsks/*',
      }

      beforeEach(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()

        cy.intercept(
          testApiGetRequest.method,
          testApiGetRequest.endpoint,
          testApiGetTwoTsksResponse
        ).as('fetchTsks')

        cy.intercept(testApiPutRequest.method, testApiPutRequest.endpoint, () =>
          Promise.resolve({
            json: () => ({
              ok: true,
              tsk,
            }),
          })
        )

        cy.intercept(
          testApiDeleteRequest.method,
          testApiDeleteRequest.endpoint,
          {
            forceNetworkError: true,
          }
        )

        cy.visit('/tsks')
        cy.wait('@fetchTsks')
        cy.get('[data-testid="tsk"]')
          .contains(tskToBeDeleted)
          .parents('li')
          .within(() => {
            cy.contains('delete').click()
          })
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

      it('renders error message', () => {
        cy.contains('Failed to fetch').should('exist')
      })

      // TODO: not working
      it('not renders loading', () => {
        cy.get('[data-testid="tsk"]')
          .contains(tskToBeDeleted)
          .parents('li')
          .within(() => {
            cy.get('button').should('not.have.class', 'loading')
          })
      })
    })
  })

  describe('renders tsk', () => {
    beforeEach(() => {
      cy.setLocalStorageUser()
      cy.setLocalStorageAuthToken()

      cy.intercept(
        testApiGetRequest.method,
        testApiGetRequest.endpoint,
        testApiGetResponse
      )

      cy.visit('/tsks')
    })

    after(() => {
      cy.removeLocalStorageUser()
      cy.removeLocalStorageAuthToken()
    })

    it('renders tsk', () => {
      cy.contains(testApiGetResponse.body.tsks[0].tsk).should('exist')
    })

    it('renders context', () => {
      cy.contains(`@${testApiGetResponse.body.tsks[0].context}`).should('exist')
    })

    describe('renders status', () => {
      describe('when todo', () => {
        before(() => {
          cy.setLocalStorageUser()
          cy.setLocalStorageAuthToken()
        })

        after(() => {
          cy.removeLocalStorageUser()
          cy.removeLocalStorageAuthToken()
        })

        beforeEach(() => {
          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetResponse
          )

          cy.visit('/tsks')
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

        before(() => {
          cy.setLocalStorageUser()
          cy.setLocalStorageAuthToken()
        })

        after(() => {
          cy.removeLocalStorageUser()
          cy.removeLocalStorageAuthToken()
        })

        beforeEach(() => {
          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetResponse
          )

          cy.visit('/tsks')
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

        before(() => {
          cy.setLocalStorageUser()
          cy.setLocalStorageAuthToken()
        })

        after(() => {
          cy.removeLocalStorageUser()
          cy.removeLocalStorageAuthToken()
        })

        beforeEach(() => {
          cy.intercept(
            testApiGetRequest.method,
            testApiGetRequest.endpoint,
            testApiGetResponse
          )

          cy.visit('/tsks')
        })

        it('renders "*"', () => {
          cy.contains('*').should('exist')
        })
      })
    })
  })
})
