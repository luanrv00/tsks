import userFixture from '../fixtures/user.json'
import getTsksFixture from '../fixtures/api-get-tsks.json'
import postTsksFixture from '../fixtures/api-post-tsks.json'
import putTsksFixture from '../fixtures/api-put-tsks.json'
import deleteTsksFixture from '../fixtures/api-delete-tsks.json'

// TODO: fix env var not being loaded
const NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY || '@tsks-user'

const NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY || '@tsks-auth-token'

describe('tsks', () => {
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
      before(() => {
        cy.setLocalStorageInvalidUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

      beforeEach(() => {
        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
          fixture: 'api-response-401',
        })
      })

      it('requests refresh token', () => {
        cy.intercept('POST', '**/v1/refresh_token').as('refreshToken')
        cy.visit('/tsks')
        cy.wait('@refreshToken')
        cy.get('@refreshToken.all').should('have.length.least', 1)
      })
    })

    describe('when auth token is forbidden', () => {
      before(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

      beforeEach(() => {
        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
          fixture: 'api-response-403',
        })

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
      cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
        fixture: 'api-response-tsks-200',
      })

      cy.visit('/tsks')
    })

    it('renders user email', () => {
      cy.contains(userFixture.email).should('exist')
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
          cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
            fixture: 'api-response-tsks-200',
          })

          cy.visit('/tsks')
        })

        it('renders each tsk succesfully', () => {
          cy.wait(2000)
          cy.fixture('api-response-tsks-200').as('tsks')
          cy.get('[data-testid="tsk"]').should('have.length.above', 0)
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
          cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
            fixture: 'api-response-tsks-200-empty',
          })

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

        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
          fixture: 'api-response-tsks-200',
        }).as('getTsks')

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
        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
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
      const tskToBeInserted = 'this is a created tsk'
      const ctxToBeInserted = 'this is a context'

      beforeEach(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()

        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
          fixture: 'api-response-tsks-200-empty',
        }).as('fetchEmptyTsks')

        cy.intercept(postTsksFixture.method, postTsksFixture.endpoint, {
          fixture: 'api-response-tsks-201',
        }).as('postTsks')
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

      it('renders tsk ', () => {
        cy.visit('/tsks')
        cy.wait('@fetchEmptyTsks')
        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
          fixture: 'api-response-tsks-200',
        }).as('fetchUpdatedTsks')
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
      before(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

      beforeEach(() => {
        cy.intercept(postTsksFixture.method, postTsksFixture.endpoint, {
          fixture: 'api-response-401',
        }).as('postTsks')
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

        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
          fixture: 'api-response-tsks-200-empty',
        }).as('fetchEmptyTsks')

        cy.intercept(postTsksFixture.method, postTsksFixture.endpoint, {
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
        cy.intercept(postTsksFixture.method, postTsksFixture.endpoint, {
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
    describe('cannot unexistent tsk', () => {
      before(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

      beforeEach(() => {
        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
          fixture: 'api-response-tsks-200',
        })

        cy.intercept(putTsksFixture.method, putTsksFixture.endpoint, {
          fixture: 'api-response-404',
        }).as('putTsk')

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
        const tskToBeUpdated = 'this is a tsk to be updated'

        before(() => {
          cy.setLocalStorageUser()
          cy.setLocalStorageAuthToken()
        })

        after(() => {
          cy.removeLocalStorageUser()
          cy.removeLocalStorageAuthToken()
        })

        beforeEach(() => {
          cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
            fixture: 'api-response-tsks-200',
          })

          cy.intercept(putTsksFixture.method, putTsksFixture.endpoint, {
            fixture: 'api-response-tsks-201',
          })

          cy.visit('/tsks')
        })

        it('renders tsk', () => {
          cy.contains(tskToBeUpdated)
            .parents('div')
            .first()
            .within(() => {
              cy.contains('+').should('not.exist')
            })
          cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
            fixture: 'api-response-tsks-200-update',
          }).as('fetchUpdatedTsks')
          cy.contains(tskToBeUpdated).click()
          cy.wait('@fetchUpdatedTsks')
          cy.contains(tskToBeUpdated)
            .parents('div')
            .first()
            .within(() => {
              cy.contains('+').should('exist')
            })
        })
      })

      describe('put done tsk', () => {
        const tskToBeDone = 'this is a tsk to be done'

        before(() => {
          cy.setLocalStorageUser()
          cy.setLocalStorageAuthToken()
        })

        after(() => {
          cy.removeLocalStorageUser()
          cy.removeLocalStorageAuthToken()
        })

        beforeEach(() => {
          cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
            fixture: 'api-response-tsks-200',
          })

          cy.intercept(putTsksFixture.method, putTsksFixture.endpoint, {
            fixture: 'api-response-tsks-201',
          })

          cy.visit('/tsks')
        })

        it('renders tsk', () => {
          cy.contains(tskToBeDone)
            .parents('div')
            .first()
            .within(() => {
              cy.contains('*').should('not.exist')
            })
          cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
            fixture: 'api-response-tsks-200-update',
          }).as('fetchUpdatedTsks')
          cy.contains(tskToBeDone).click()
          cy.wait('@fetchUpdatedTsks')
          cy.contains(tskToBeDone)
            .parents('div')
            .first()
            .within(() => {
              cy.contains('*').should('exist')
            })
        })
      })

      // TODO: write tests and implementation
      describe('put tsk content', () => {})
    })

    describe('when auth token is unauthorized', () => {
      before(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

      beforeEach(() => {
        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
          fixture: 'api-response-tsks-200',
        }).as('getTsks')

        cy.intercept(putTsksFixture.method, putTsksFixture.endpoint, {
          fixture: 'api-response-401',
        }).as('putTsk')
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

    describe('delete succesfully', () => {
      beforeEach(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()

        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
          fixture: 'api-response-tsks-200',
        }).as('fetchTsks')

        cy.intercept(deleteTsksFixture.method, deleteTsksFixture.endpoint, {
          fixture: 'api-response-204',
        }).as('deleteTsk')

        cy.visit('/tsks')
        cy.wait('@fetchTsks')
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

      it('renders "deleted succesfully"', () => {
        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
          fixture: 'api-response-tsks-200-update',
        }).as('fetchTsksAfterDeletion')
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
        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
          fixture: 'api-response-tsks-200-update',
        }).as('fetchTsksAfterDeletion')
        cy.contains(tskToBeDeleted)
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
      before(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()
      })

      after(() => {
        cy.removeLocalStorageUser()
        cy.removeLocalStorageAuthToken()
      })

      beforeEach(() => {
        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
          fixture: 'api-response-tsks-200',
        }).as('getTsks')

        cy.intercept(deleteTsksFixture.method, deleteTsksFixture.endpoint, {
          fixture: 'api-response-401',
        }).as('deleteTsk')
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
      beforeEach(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()

        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
          fixture: 'api-response-tsks-200',
        }).as('fetchTsks')

        cy.intercept(deleteTsksFixture.method, deleteTsksFixture.endpoint, {
          delay: 5000,
        }).as('deleteTsk')

        cy.intercept(putTsksFixture.method, putTsksFixture.endpoint)

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
      beforeEach(() => {
        cy.setLocalStorageUser()
        cy.setLocalStorageAuthToken()

        cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
          fixture: 'api-response-tsks-200',
        }).as('fetchTsks')

        // NOTE: promise
        cy.intercept(putTsksFixture.method, putTsksFixture.endpoint, {
          fixture: 'api-response-tsks-201',
        })

        cy.intercept(deleteTsksFixture.method, deleteTsksFixture.endpoint, {
          forceNetworkError: true,
        })

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
    const tskUnique = 'this is a unique tsk'
    const ctxUnique = 'this is a unique context'

    beforeEach(() => {
      cy.setLocalStorageUser()
      cy.setLocalStorageAuthToken()

      cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
        fixture: 'api-response-tsks-200',
      })

      cy.visit('/tsks')
    })

    after(() => {
      cy.removeLocalStorageUser()
      cy.removeLocalStorageAuthToken()
    })

    it('renders tsk', () => {
      cy.contains(tskUnique).should('exist')
    })

    it('renders context', () => {
      cy.contains(ctxUnique).should('exist')
    })

    describe('renders status', () => {
      const tskUnique = 'this is a unique tsk'
      const tskUniqueDoing = 'this is a unique tsk doing'
      const tskUniqueDone = 'this is a unique tsk done'

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
          cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
            fixture: 'api-response-tsks-200',
          })

          cy.visit('/tsks')
        })

        it('renders "-"', () => {
          cy.contains(tskUnique)
            .parents('div')
            .first()
            .within(() => {
              cy.contains('-').should('exist')
            })
        })
      })

      describe('when doing', () => {
        before(() => {
          cy.setLocalStorageUser()
          cy.setLocalStorageAuthToken()
        })

        after(() => {
          cy.removeLocalStorageUser()
          cy.removeLocalStorageAuthToken()
        })

        beforeEach(() => {
          cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
            fixture: 'api-response-tsks-200',
          })

          cy.visit('/tsks')
        })

        it('renders "+"', () => {
          cy.contains(tskUniqueDoing)
            .parents('div')
            .first()
            .within(() => {
              cy.contains('+').should('exist')
            })
        })
      })

      describe('when done', () => {
        before(() => {
          cy.setLocalStorageUser()
          cy.setLocalStorageAuthToken()
        })

        after(() => {
          cy.removeLocalStorageUser()
          cy.removeLocalStorageAuthToken()
        })

        beforeEach(() => {
          cy.intercept(getTsksFixture.method, getTsksFixture.endpoint, {
            fixture: 'api-response-tsks-200',
          })

          cy.visit('/tsks')
        })

        it('renders "*"', () => {
          cy.contains(tskUniqueDone)
            .parents('div')
            .first()
            .within(() => {
              cy.contains('*').should('exist')
            })
        })
      })
    })
  })
})
