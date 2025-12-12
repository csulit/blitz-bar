import { instantPostgres } from 'get-db/sdk'
import { readFileSync, existsSync } from 'fs'
import type { Plugin } from 'vite'
import pg from 'pg'

interface NeonPluginOptions {
  seed?: {
    type: 'sql-script'
    path: string
  }
  referrer?: string
  dotEnvKey?: string
}

export default function createNeonPlugin(
  options: NeonPluginOptions = {},
): Plugin {
  const {
    seed,
    referrer = 'create-tanstack',
    dotEnvKey = 'VITE_DATABASE_URL',
  } = options

  let initialized = false

  return {
    name: 'get-db-postgres',
    async configResolved() {
      if (initialized) return
      initialized = true

      if (process.env[dotEnvKey]) {
        return
      }

      try {
        const result = await instantPostgres({
          dotEnvKey,
          referrer,
        })

        if (seed?.type === 'sql-script' && seed.path && existsSync(seed.path)) {
          const sql = readFileSync(seed.path, 'utf-8')
          const client = new pg.Client({ connectionString: result.databaseUrl })
          await client.connect()
          await client.query(sql)
          await client.end()
        }
      } catch (error) {
        console.error('Failed to provision database:', error)
      }
    },
  }
}
