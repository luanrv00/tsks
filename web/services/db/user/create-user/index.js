import {db, usersTable} from '../../../../lib'

// TODO: write tests
export async function createUser({email, passwordDigest, refreshToken}) {
  const user = {
    email,
    password_digest: passwordDigest,
    refresh_token: refreshToken,
  }

  const [createdUser] = await db.insert(usersTable).values(user).returning()
  return createdUser
}
