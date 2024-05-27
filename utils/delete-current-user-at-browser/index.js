const {NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY} = process.env

export function deleteCurrentUserAtBrowser() {
  window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
}
