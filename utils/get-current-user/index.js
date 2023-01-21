const {NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY} = process.env

export function getCurrentUser() {
  return JSON.parse(
    window.localStorage.getItem(NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY)
  )
}
