import user from '../../cypress/fixtures/user.json'
import {getCurrentUserAtBrowser} from '.'

const {NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY} = process.env

describe('getCurrentUserAtBrowser', () => {
  describe('when has user on localStorage', () => {
    beforeEach(() => {
      localStorage.setItem(
        NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
        JSON.stringify(user)
      )
    })

    afterEach(() => {
      localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
    })

    it('returns user', () => {
      expect(getCurrentUserAtBrowser(user)).toStrictEqual(user)
    })
  })

  describe('when has not user on localStorage', () => {
    it('returns null', () => {
      expect(getCurrentUserAtBrowser(user)).toBeNull()
    })
  })
})
