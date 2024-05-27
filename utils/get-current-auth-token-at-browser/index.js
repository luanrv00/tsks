const {NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY} = process.env

export function getCurrentAuthTokenAtBrowser() {
  return window.localStorage.getItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY)
}
