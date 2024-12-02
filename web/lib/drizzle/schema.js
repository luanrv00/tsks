import {boolean} from 'drizzle-orm/mysql-core'
import {pgTable, uuid, varchar} from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar().notNull(),
  password_digest: varchar().notNull(),
  refresh_token: varchar(),
  created_at: varchar().notNull(),
  updated_at: varchar().notNull(),
})

export const tsksTable = pgTable('tsks', {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid().notNull(),
  tsk: varchar().notNull(),
  context: varchar().notNull().default('inbox'),
  status: boolean().default('todo'),
  created_at: varchar().notNull(),
  updated_at: varchar().notNull(),
  deleted_at: varchar().notNull(),
})
