import { db } from '$lib/server/db';
import { userRole } from '$lib/server/db/schema';
import type { Role } from '$lib/shared';
import { eq } from 'drizzle-orm';

/**
 * 获取用户拥有的所有角色
 * @param userId 用户 ID
 */
export async function getRolesByUser(userId: string): Promise<Role[]> {
	const result = await db.query.userRole.findMany({
		where: eq(userRole.userId, userId),
		with: {
			role: true
		}
	});

	return result.map((ur) => ur.role);
}

/**
 * 获取列表角色
 */
export async function getRoles(): Promise<Role[]> {
	const result = await db.query.role.findMany();
	return result;
}
