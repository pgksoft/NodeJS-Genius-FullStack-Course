import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'

let dbInstance: Database | null = null

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance

  dbInstance = await open({
    filename: 'rdb-lite.db',
    driver: sqlite3.Database,
  })

  return dbInstance
}
