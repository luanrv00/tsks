import 'dotenv/config'
import {defineConfig} from 'drizzle-kit'

export default defineConfig({
  out: './lib/drizzle',
  schema: './lib/drizzle/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
