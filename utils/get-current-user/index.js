const TSKS_LOCALSTORAGE_KEY_NAME = process.env.TSKS_LOCALSTORAGE_KEY_NAME

export function getCurrentUser() {
  return JSON.parse(window.localStorage.getItem(TSKS_LOCALSTORAGE_KEY_NAME))
}
