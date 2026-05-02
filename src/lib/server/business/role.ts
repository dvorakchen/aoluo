import { db } from '$lib/server/db';
import { role } from '$lib/server/db/schema';
import { inArray } from 'drizzle-orm';
import type { PermissionValue } from '$lib/shared';

/**
 * 获取指定角色关联的权限
 * @param roleIds 角色 ID 或 ID 数组
 */
export async function getRolePermissions(roleIds: string | string[]): Promise<PermissionValue[]> {
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
