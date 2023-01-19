import user from '../../cypress/fixtures/user.json'
import {getCurrentUser} from '.'

const TSKS_LOCALSTORAGE_KEY_NAME = process.env.TSKS_LOCALSTORAGE_KEY_NAME

describe('getCurrentUser', () => {
  describe('when has user on localStorage', () => {
    beforeEach(() => {
      localStorage.setItem(TSKS_LOCALSTORAGE_KEY_NAME, JSON.stringify(user))
    })

    afterEach(() => {
      localStorage.removeItem(TSKS_LOCALSTORAGE_KEY_NAME)
    })

    it('returns user', () => {
      expect(getCurrentUser(user)).toStrictEqual(user)
    })
  })

  describe('when has not user on localStorage', () => {
    it('returns null', () => {
      expect(getCurrentUser(user)).toBeNull()
    })
  })
})
