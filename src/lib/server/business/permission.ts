import { DBService } from '$lib/server/db';
import { role } from '$lib/server/db/schema';
import { inArray } from 'drizzle-orm';
import type { PermissionValue } from '$lib/shared';
import { injectable } from 'tsyringe';
import { RoleService } from '$lib/server/business/role';

@injectable()
export class PermissionService {
	constructor(
		private dbService: DBService,
		private roleService: RoleService
	) {}

	private get db() {
		return this.dbService.db;
	}

	/**
	 * 获取指定角色关联的权限
	 * @param roleIds 角色 ID 或 ID 数组
	 */
	async getPermissionsByRoles(roleIds: string | string[]): Promise<PermissionValue[]> {
		const ids = Array.isArray(roleIds) ? roleIds : [roleIds];

		if (ids.length === 0) return [];

		const result = await this.db
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
	async getPermissionsByUserId(userId: string): Promise<PermissionValue[]> {
		const roles = await this.roleService.getRolesByUser(userId);
		const pers = await this.getPermissionsByRoles(roles.map((r) => r.id));
		return pers;
	}
}
