import { neon } from '@neondatabase/serverless'

let client: ReturnType<typeof neon> | undefined

export async function getClient() {
  const databaseUrl = process.env.VITE_DATABASE_URL
  if (!databaseUrl) {
    return undefined
  }
  if (!client) {
    client = await neon(databaseUrl)
  }
  return client
}
