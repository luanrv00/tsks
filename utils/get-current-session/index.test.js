import user from '../../cypress/fixtures/user.json'
import {getCurrentSession} from '.'

const TSKS_AUTH_TOKEN_NAME = process.env.TSKS_AUTH_TOKEN_NAME

describe('getCurrentSession', () => {
  describe('when has session', () => {
    beforeEach(() => {
      window.localStorage.setItem(TSKS_AUTH_TOKEN_NAME, JSON.stringify(user))
    })

    afterEach(() => {
      window.localStorage.removeItem(TSKS_AUTH_TOKEN_NAME)
    })

    it('returns user from localStorage', () => {
      expect(getCurrentSession()).toStrictEqual(user)
    })
  })

  describe('when has not session', () => {
    it('returns null', () => {
      expect(getCurrentSession()).toBeNull()
    })
  })
})
