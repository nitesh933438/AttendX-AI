import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from './schema.js';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("WARNING: DATABASE_URL is not set. Drizzle ORM will fail if queries are executed.");
}

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
