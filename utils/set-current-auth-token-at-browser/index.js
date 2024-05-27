const {NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY} = process.env

export function setCurrentAuthTokenAtBrowser(authToken) {
  window.localStorage.setItem(
    NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY,
    JSON.stringify(authToken)
  )
}
