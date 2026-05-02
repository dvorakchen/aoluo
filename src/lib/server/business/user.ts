import { db } from '$lib/server/db';
import { role, userRole } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PermissionSchema, PermissionValue } from '$lib/shared';

/**
 * 获取用户关联的所有权限
 * @param userId 用户 ID
 */
export async function getUserPermissions(userId: string): Promise<PermissionValue[]> {
	const result = await db
		.select({
			permissions: role.permissions
		})
		.from(userRole)
		.innerJoin(role, eq(userRole.roleId, role.id))
		.where(eq(userRole.userId, userId));

	// 合并并去重权限
	const allPermissions = new Set<PermissionValue>();
	result.forEach((r) => {
		r.permissions.forEach((p) => {
			allPermissions.add(p as PermissionValue);
		});
	});

	return Array.from(allPermissions);
}

/**
 * 用户是否有权限
 * @param userId 用户 user_id
 * @param permissions 权限策略
 */
export async function hasPermissions(
	userId: string,
	permissions: PermissionSchema
): Promise<boolean> {
	const userPerms = await getUserPermissions(userId);
	const userPermSet = new Set(userPerms);

	// 检查 'all' 条件：必须满足数组中所有的权限
	if (permissions.all.length > 0) {
		const hasAll = permissions.all.every((p) => userPermSet.has(p));
		if (!hasAll) return false;
	}

	// 检查 'any' 条件：只需满足数组中任意一个权限
	if (permissions.any.length > 0) {
		const hasAny = permissions.any.some((p) => userPermSet.has(p));
		if (!hasAny) return false;
	}

	// 如果没有定义任何限制，或者所有限制都通过了，返回 true
	return true;
}
