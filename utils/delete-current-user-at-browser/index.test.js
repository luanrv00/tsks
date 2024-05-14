import user from '../../cypress/fixtures/user.json'
import {deleteCurrentUserAtBrowser} from '.'

const TSKS_LOCALSTORAGE_KEY_NAME = process.env.TSKS_LOCALSTORAGE_KEY_NAME

describe('deleteCurrentUserAtBrowser', () => {
  beforeEach(() => {
    localStorage.setItem(TSKS_LOCALSTORAGE_KEY_NAME, JSON.stringify(user))
  })

  it('deletes user from localStorage', () => {
    deleteCurrentUserAtBrowser(user)

    expect(
      JSON.parse(localStorage.getItem(TSKS_LOCALSTORAGE_KEY_NAME))
    ).toBeNull()
  })
})
