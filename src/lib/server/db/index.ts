import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.ADMIN_DATABASE_URL) throw new Error('ADMIN_DATABASE_URL is not set');

const client = postgres(env.ADMIN_DATABASE_URL);

export const db = drizzle(client, { schema });
