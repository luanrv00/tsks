export function getCurrentSession() {
  return JSON.parse(window.localStorage.getItem('@tsks-user'))
}
