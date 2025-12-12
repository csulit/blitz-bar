import { config } from 'dotenv'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from './schema.ts'
import { env } from '@/env.ts'

config()

const pool = new Pool({
  connectionString: env.VITE_DATABASE_URL,
})
export const db = drizzle(pool, { schema })
