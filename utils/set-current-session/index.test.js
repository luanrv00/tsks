import user from '../../cypress/fixtures/user.json'
import {setCurrentSession} from '.'

describe('setCurrentSession', () => {
  afterEach(() => {
    window.localStorage.removeItem('@tsks-user')
  })

  it('saves received user on localStorage', () => {
    setCurrentSession(user)
    expect(JSON.parse(localStorage.getItem('@tsks-user'))).toStrictEqual(user)
  })
})
