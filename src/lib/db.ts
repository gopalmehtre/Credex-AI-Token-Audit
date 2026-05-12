import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDb(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const url = new URL(process.env.DATABASE_URL);
    pool = new Pool({
      host: url.hostname,
      port: parseInt(url.port || '5432'),
      database: url.pathname.slice(1),
      user: url.username,
      password: url.password,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle DB client', err);
    });
  }
  return pool;
}

export async function query<T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const db = getDb();
  const result = await db.query(sql, params);
  return result.rows as T[];
}

export async function queryOne<T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}
