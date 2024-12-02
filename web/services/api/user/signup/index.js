import {validateEmail} from '../../../../utils'
import {db, usersTable} from '../../../../lib'
import {eq} from 'drizzle-orm'

export async function apiUserSignup({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<APIResponseType> {
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

  const userByEmail: [] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))

  if (userByEmail.length) {
    return {status_code: 409, message: '409 Conflict', ok: false}
  }

  return {status_code: 0, message: '0', ok: false}
}

export type APIResponseType = {
  ok: boolean
  status_code: number
  message?: string
  data?: []
}
