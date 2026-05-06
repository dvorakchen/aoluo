import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { singleton } from 'tsyringe';

if (!env.ADMIN_DATABASE_URL) throw new Error('ADMIN_DATABASE_URL is not set');

const client = postgres(env.ADMIN_DATABASE_URL);

/**
 * 要使用数据据库连接实例，请通过 DBService 类的 db 属性访问！
 * 当前示例在 berrer-auth 初始化和 seed.ts 中使用了这个连接实例。
 */
export const db = drizzle(client, { schema });

/**
 * 数据库服务类，提供对数据库连接实例的访问。这个类使用 tsyringe 的 @singleton 装饰器声明为全局单例，确保整个应用中只有一个数据库连接实例。
 */
@singleton()
export class DBService {
	/**
	 * 数据库连接实例，使用 Drizzle ORM 进行数据库操作。这个实例是全局单例的，可以在整个应用中共享。
	 */
	get db() {
		return db;
	}
}
