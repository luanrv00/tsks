import {getCurrentAuthTokenAtBrowser} from '.'

const {NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY} = process.env

describe('getCurrentAuthTokenAtBrowser', () => {
  const authToken = 'auth-token'

  describe('when has auth token on localStorage', () => {
    beforeEach(() => {
      localStorage.setItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY, authToken)
    })

    afterEach(() => {
      localStorage.removeItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY)
    })

    it('returns auth token', () => {
      expect(getCurrentAuthTokenAtBrowser()).toStrictEqual(authToken)
    })
  })

  describe('when has not auth token on localStorage', () => {
    it('returns null', () => {
      expect(getCurrentAuthTokenAtBrowser()).toBeNull()
    })
  })
})
