import {validateEmail} from '../../../../utils'
import {selectUserByEmail} from '../../../db/'

export async function apiUserSignup({email, password}) {
  if (!email) {
    return {status_code: 400, message: '400 Bad Request', ok: false}
  }

  if (!password) {
    return {status_code: 400, message: '400 Bad Request', ok: false}
  }

  const isEmailValid = validateEmail(email)

  if (!isEmailValid) {
    return {status_code: 400, message: '400 Bad Request', ok: false}
  }

  const userByEmail = selectUserByEmail(email)

  if (userByEmail.length) {
    return {status_code: 409, message: '409 Conflict', ok: false}
  }

  return {status_code: 0, message: '0', ok: false}
}
