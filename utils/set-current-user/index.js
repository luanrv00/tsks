const {NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY} = process.env

export function setCurrentUser(user) {
  window.localStorage.setItem(
    NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY,
    JSON.stringify(user)
  )
}
