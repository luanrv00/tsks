import user from '../fixtures/user.json'

// TODO: fix env var not being loaded
const NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY || '@tsks-user'

describe('signup', () => {
  const testApiPostRequest = {
    method: 'POST',
    endpoint: '**/v1/signup',
  }

  context('cannot without email', () => {
    beforeEach(() => {
      cy.visit('/signup')
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('required').should('exist')
    })
  })

  context('cannot without password', () => {
    beforeEach(() => {
      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type(user.email)
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('required').should('exist')
    })
  })

  context('cannot without valid email', () => {
    beforeEach(() => {
      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type('invalid email')
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('invalid email').should('exist')
    })
  })

  context('cannot without unregistered email', () => {
    const testApiPostResponse = {
      statusCode: 409,
      body: {
        ok: false,
        message: '409 Conflict',
      },
    }

    beforeEach(() => {
      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type(user.email)
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('409 Conflict').should('exist')
    })
  })

  context('signup succesfully', () => {
    const testApiPostResponse = {
      statusCode: 201,
      body: {
        ok: true,
        user,
      },
    }

    beforeEach(() => {
      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type(user.email)
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('saves user on localStorage', () => {
      cy.wait(2000)
      cy.window().then(window => {
        const localStorageUser = JSON.parse(
          window.localStorage.getItem(NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY)
        )

        expect(localStorageUser).to.deep.eq(user)
      })
    })

    it('redirects to tsks', () => {
      cy.location('pathname').should('eq', '/tsks')
    })
  })

  describe('renders a link to signin', () => {
    beforeEach(() => {
      cy.visit('/signup')
    })

    it('renders a link to signin', () => {
      cy.contains('or signin to your account').should('exist')
    })

    it('redirects to signin when clicking', () => {
      cy.location('pathname').should('eq', '/signup')
      cy.contains('or signin to your account').click()
      cy.location('pathname').should('eq', '/signin')
    })
  })
})
