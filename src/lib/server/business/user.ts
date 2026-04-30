import { db } from '$lib/server/db';
import { type RoleKey, DEFAULT_ROLES } from '$lib/shared/permissions';

/**
 * 获取用户在特定组织下的所有权限
 * @param userId 用户 ID
 * @param organizationId 组织 ID
 */
export async function getUserPermissions(userId: string, organizationId: string) {
	// 1. 从数据库获取用户的角色
	const orgMember = await db.query.member.findFirst({
		where: (member, { and, eq }) =>
			and(eq(member.userId, userId), eq(member.organizationId, organizationId))
	});

	if (!orgMember) {
		return null;
	}

	const roleKey = orgMember.role as RoleKey;

	// 2. 从预定义的角色配置中获取权限
	const roleConfig = DEFAULT_ROLES[roleKey];

	if (!roleConfig) {
		return null;
	}

	// 返回角色名称和具体的权限声明
	return {
		role: roleKey,
		statements: roleConfig.statements
	};
}
