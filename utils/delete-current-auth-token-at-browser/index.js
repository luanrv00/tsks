const NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY

export function deleteCurrentAuthTokenAtBrowser() {
  window.localStorage.removeItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY)
}
