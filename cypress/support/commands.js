import user from '../fixtures/user.js'
import invalidUser from '../fixtures/invalid-user.json'

const NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY || '@tsks-user'

const NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY || '@tsks-auth-token'

Cypress.Commands.add('setLocalStorageUser', () => {
  cy.window().then(window =>
    window.localStorage.setItem(
      NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
      JSON.stringify(user)
    )
  )
})

Cypress.Commands.add('setLocalStorageInvalidUser', () => {
  cy.window().then(window =>
    window.localStorage.setItem(
      NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
      JSON.stringify(invalidUser)
    )
  )
})

Cypress.Commands.add('removeLocalStorageUser', () => {
  cy.window().then(window =>
    window.localStorage.removeItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
  )
})

Cypress.Commands.add('setLocalStorageAuthToken', () => {
  cy.window().then(window =>
    window.localStorage.setItem(
      NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY,
      JSON.stringify('auth-token')
    )
  )
})

Cypress.Commands.add('removeLocalStorageAuthToken', () => {
  cy.window().then(window =>
    window.localStorage.removeItem(NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY)
  )
})
