import {deleteCurrentAuthTokenAtBrowser} from '.'

const {NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY} = process.env

describe('deleteCurrentAuthTokenAtBrowser', () => {
  const authToken = 'auth-token'

  beforeEach(() => {
    localStorage.setItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY, authToken)
  })

  it('deletes auth token from localStorage', () => {
    deleteCurrentAuthTokenAtBrowser()

    expect(
      JSON.parse(localStorage.getItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY))
    ).toBeNull()
  })
})
