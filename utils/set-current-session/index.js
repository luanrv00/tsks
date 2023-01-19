const TSKS_AUTH_TOKEN_NAME = process.env.TSKS_AUTH_TOKEN_NAME

export function setCurrentSession(user) {
  window.localStorage.setItem(TSKS_AUTH_TOKEN_NAME, JSON.stringify(user))
}
