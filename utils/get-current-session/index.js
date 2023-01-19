const TSKS_AUTH_TOKEN_NAME = process.env.TSKS_AUTH_TOKEN_NAME

export function getCurrentSession() {
  return JSON.parse(window.localStorage.getItem(TSKS_AUTH_TOKEN_NAME))
}
