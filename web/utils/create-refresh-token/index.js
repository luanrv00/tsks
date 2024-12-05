const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY

export async function createRefreshToken(email) {
  const token = await new jose.SignJWT({email})
    .setProtectedHeader({alg: 'HS256'})
    .setExpirationTime('10h')
    .sign(REFRESH_TOKEN_KEY)

  return token
}
