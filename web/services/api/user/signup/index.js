import {validateEmail} from '../../../../utils'
import {selectUsersByEmail} from '../../../db/'

// TODO:
// - genereate access_token
// - genereate refresh_token
// - save user on db
// - return user
export async function apiUserSignup({email, password}) {
  if (!email) {
    return {status_code: 400, message: '400 Bad Request', ok: false}
  }

  if (!password) {
    return {status_code: 400, message: '400 Bad Request', ok: false}
  }

  const isValidEmail = validateEmail(email)

  if (!isValidEmail) {
    return {status_code: 400, message: '400 Bad Request', ok: false}
  }

  const usersByEmail = selectUsersByEmail(email)

  if (usersByEmail.length) {
    return {status_code: 409, message: '409 Conflict', ok: false}
  }

  return {status_code: 0, message: '0', ok: false}
}
