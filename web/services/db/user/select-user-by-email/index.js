import {eq} from 'drizzle-orm'
import {db, usersTable} from '../../../../lib'

// TODO: write tests
export async function selectUserByEmail(email) {
  return db.select().from(usersTable).where(eq(usersTable.email, email))
}
