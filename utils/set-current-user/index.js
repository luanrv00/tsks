const TSKS_LOCALSTORAGE_KEY_NAME = process.env.TSKS_LOCALSTORAGE_KEY_NAME

export function setCurrentUser(user) {
  window.localStorage.setItem(TSKS_LOCALSTORAGE_KEY_NAME, JSON.stringify(user))
}
