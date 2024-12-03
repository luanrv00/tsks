import {pgTable, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar().notNull(),
  password_digest: varchar().notNull(),
  refresh_token: varchar(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp(),
})

export const tsksTable = pgTable('tsks', {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid().notNull(),
  tsk: varchar().notNull(),
  context: varchar().notNull().default('inbox'),
  status: varchar().default('todo'),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp(),
  deleted_at: timestamp(),
})
