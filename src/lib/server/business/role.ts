import { DBService } from '$lib/server/db';
import { userRole } from '$lib/server/db/schema';
import type { Role } from '$lib/shared';
import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

@injectable()
export class RoleService {
	constructor(private dbService: DBService) {}

	private get db() {
		return this.dbService.db;
	}

	/**
	 * 获取用户拥有的所有角色
	 * @param userId 用户 ID
	 */
	async getRolesByUser(userId: string): Promise<Role[]> {
		const result = await this.db.query.userRole.findMany({
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
	async getRoles(): Promise<Role[]> {
		const result = await this.db.query.role.findMany();
		return result;
	}
}
