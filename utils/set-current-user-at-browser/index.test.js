import user from '../../cypress/fixtures/user.json'
import {setCurrentUserAtBrowser} from '.'

const {NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY} = process.env

describe('setCurrentUserAtBrowserAtBrowser', () => {
  afterEach(() => {
    localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
  })

  it('saves received user on localStorage', () => {
    setCurrentUserAtBrowser(user)

    expect(
      JSON.parse(localStorage.getItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY))
    ).toStrictEqual(user)
  })
})
