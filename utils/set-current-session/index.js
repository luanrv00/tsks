export function setCurrentSession(user) {
  window.localStorage.setItem('@tsks-user', JSON.stringify(user))
}
