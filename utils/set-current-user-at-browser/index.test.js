import user from '../../cypress/fixtures/user.json'
import {setCurrentUserAtBrowser} from '.'

const TSKS_LOCALSTORAGE_KEY_NAME = process.env.TSKS_LOCALSTORAGE_KEY_NAME

describe('setCurrentUserAtBrowserAtBrowser', () => {
  afterEach(() => {
    localStorage.removeItem(TSKS_LOCALSTORAGE_KEY_NAME)
  })

  it('saves received user on localStorage', () => {
    setCurrentUserAtBrowser(user)

    expect(
      JSON.parse(localStorage.getItem(TSKS_LOCALSTORAGE_KEY_NAME))
    ).toStrictEqual(user)
  })
})
