import {db, usersTable} from '../../../../lib'

// TODO: write tests
export async function createUser({email, passwordDigest, refreshToken}) {
  const user = {
    email,
    password_digest: passwordDigest,
    refresh_token: refreshToken,
  }

  return await db.insert(usersTable).values(user)
}
