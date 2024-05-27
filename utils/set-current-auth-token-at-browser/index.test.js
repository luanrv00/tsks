import {setCurrentAuthTokenAtBrowser} from '.'

const {NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY} = process.env

describe('setCurrentAuthTokenAtBrowser', () => {
  const authToken = 'auth-token'

  afterEach(() => {
    localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
  })

  it('saves received auth token on localStorage', () => {
    setCurrentAuthTokenAtBrowser(authToken)

    expect(
      JSON.parse(localStorage.getItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY))
    ).toStrictEqual(authToken)
  })
})
