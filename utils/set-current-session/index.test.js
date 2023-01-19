import user from '../../cypress/fixtures/user.json'
import {setCurrentSession} from '.'

const TSKS_AUTH_TOKEN_NAME = process.env.TSKS_AUTH_TOKEN_NAME

describe('setCurrentSession', () => {
  afterEach(() => {
    window.localStorage.removeItem(TSKS_AUTH_TOKEN_NAME)
  })

  it('saves received user on localStorage', () => {
    setCurrentSession(user)
    expect(
      JSON.parse(localStorage.getItem(TSKS_AUTH_TOKEN_NAME))
    ).toStrictEqual(user)
  })
})
