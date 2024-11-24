import {integer, pgTable, varchar} from 'drizzle-orm/pg-core'

export const testTable = pgTable('drizzletests', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
})
