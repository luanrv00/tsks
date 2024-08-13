const NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY

export function getCurrentUserAtBrowser() {
  return JSON.parse(
    window.localStorage.getItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
  )
}
