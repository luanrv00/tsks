const NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY

export function deleteCurrentUserAtBrowser() {
  window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
}
