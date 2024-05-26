const {NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY} = process.env

export function getCurrentUserAtBrowser() {
  return JSON.parse(
    window.localStorage.getItem(NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY)
  )
}
