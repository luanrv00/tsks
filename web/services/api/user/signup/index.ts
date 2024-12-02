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

  return {status_code: 0, message: '0', ok: false}
}

export type APIResponseType = {
  ok: boolean
  status_code: number
  message?: string
  data?: []
}
