const ACESS_TOKEN_KEY = process.env.ACESS_TOKEN_KEY

export async function createAccessToken(email) {
  const token = await new jose.SignJWT({email})
    .setProtectedHeader({alg: 'HS256'})
    .setExpirationTime('1h')
    .sign(ACESS_TOKEN_KEY)

  return token
}
