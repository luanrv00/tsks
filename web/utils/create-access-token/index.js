import * as jose from 'jose'

const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY

export async function createAccessToken(email) {
  const accessKey = new TextEncoder().encode(ACCESS_TOKEN_KEY)

  const token = await new jose.SignJWT({email})
    .setProtectedHeader({alg: 'HS256'})
    .setExpirationTime('1h')
    .sign(accessKey)

  return token
}
