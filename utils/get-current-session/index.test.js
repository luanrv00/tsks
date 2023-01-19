import user from '../../cypress/fixtures/user.json'
import {getCurrentSession} from '.'

describe('getCurrentSession', () => {
  describe('when has session', () => {
    beforeEach(() => {
      window.localStorage.setItem('@tsks-user', JSON.stringify(user))
    })

    afterEach(() => {
      window.localStorage.removeItem('@tsks-user')
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
