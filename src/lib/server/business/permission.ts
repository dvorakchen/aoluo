import { db } from '$lib/server/db';
import { role } from '$lib/server/db/schema';
import { inArray } from 'drizzle-orm';
import type { PermissionValue } from '$lib/shared';
import { getRolesByUser } from './role';

/**
 * 获取指定角色关联的权限
 * @param roleIds 角色 ID 或 ID 数组
 */
export async function getPermissionsByRoles(
	roleIds: string | string[]
): Promise<PermissionValue[]> {
	const ids = Array.isArray(roleIds) ? roleIds : [roleIds];

	if (ids.length === 0) return [];

	const result = await db
		.select({
			permissions: role.permissions
		})
		.from(role)
		.where(inArray(role.id, ids));

	const allPermissions = new Set<PermissionValue>();
	result.forEach((r) => {
		r.permissions.forEach((p) => {
			allPermissions.add(p as PermissionValue);
		});
	});

	return Array.from(allPermissions);
}

/**
 * 获取指定用户关联的权限
 * @param userId 用户 ID
 */
export async function getPermissionsByUserId(userId: string): Promise<PermissionValue[]> {
	const roles = await getRolesByUser(userId);
	const pers = await getPermissionsByRoles(roles.map((r) => r.id));
	return pers;
}
