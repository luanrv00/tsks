import {integer, pgTable, varchar} from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar().notNull(),
  password: varchar().notNull(),
})

export const tsksTable = pgTable('tsks', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer.notNull(),
  tsk: varchar().notNull(),
  context: varchar().notNull(),
})
