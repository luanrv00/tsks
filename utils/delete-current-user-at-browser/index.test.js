import user from '../../cypress/fixtures/user.json'
import {deleteCurrentUserAtBrowser} from '.'

const {NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY} = process.env

describe('deleteCurrentUserAtBrowser', () => {
  beforeEach(() => {
    localStorage.setItem(NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY, JSON.stringify(user))
  })

  it('deletes user from localStorage', () => {
    deleteCurrentUserAtBrowser(user)

    expect(
      JSON.parse(localStorage.getItem(NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY))
    ).toBeNull()
  })
})
