import {boolean} from 'drizzle-orm/mysql-core'
import {pgTable, uuid, varchar} from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar().notNull(),
  password_digest: varchar().notNull(),
  refresh_token: varchar(),
  created_at: varchar(),
  updated_at: varchar(),
})

export const tsksTable = pgTable('tsks', {
  id: uuid().primaryKey().defaultRandom(),
  user_id: varchar.notNull(),
  tsk: varchar().notNull(),
  context: varchar().notNull().default('inbox'),
  status: boolean().default('todo'),
  created_at: varchar(),
  updated_at: varchar(),
  deleted_at: varchar(),
})
