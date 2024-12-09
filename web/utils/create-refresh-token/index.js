import * as jose from 'jose'

const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY

export async function createRefreshToken(email) {
  const refreshKey = new TextEncoder().encode(REFRESH_TOKEN_KEY)

  const token = await new jose.SignJWT({email})
    .setProtectedHeader({alg: 'HS256'})
    .setExpirationTime('10h')
    .sign(refreshKey)

  return token
}
