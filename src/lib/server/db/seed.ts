import { db } from '$lib/server/db';
import { logger } from '$lib/server/logger';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import type { DbI18nField } from '$lib/shared';
import { PERMISSIONS } from '$lib/shared';

export async function seed() {
	logger.info('⏳ Seeding database with full company structure and multiple roles...');

	const password = '123123123';

	// 1. 定义权限集合
	const allPermissions = [
		PERMISSIONS.team.read,
		PERMISSIONS.team.create,
		PERMISSIONS.team.update,
		PERMISSIONS.team.delet
	];

	// 2. 定义角色及其配置
	const rolesConfig: Record<string, { name: DbI18nField; permissions: string[] }> = {
		admin: {
			name: { default: '系统管理员', zh: '系统管理员', en: 'System Admin' },
			permissions: allPermissions
		},
		boss: {
			name: { default: '老板', zh: '老板', en: 'Boss' },
			permissions: allPermissions
		},
		manager: {
			name: { default: '部门经理', zh: '部门经理', en: 'Manager' },
			permissions: [PERMISSIONS.team.read, PERMISSIONS.team.update]
		},
		dev: {
			name: { default: '开发者', zh: '开发者', en: 'Developer' },
			permissions: allPermissions
		},
		employee: {
			name: { default: '普通员工', zh: '普通员工', en: 'Employee' },
			permissions: [PERMISSIONS.team.read]
		}
	};

	// 3. 创建角色并建立映射
	const roleIdMap: Record<string, string> = {};
	for (const [key, config] of Object.entries(rolesConfig)) {
		const existing = await db.query.role.findFirst({
			where: (table, { sql }) => sql`${table.name}->>'en' = ${config.name.en}`
		});

		if (existing) {
			roleIdMap[key] = existing.id;
			logger.info(`ℹ️ Role already exists: ${config.name.zh}`);
		} else {
			const [inserted] = await db
				.insert(schema.role)
				.values({
					name: config.name,
					permissions: config.permissions
				})
				.returning();
			roleIdMap[key] = inserted.id;
			logger.info(`✅ Role created: ${config.name.zh}`);
		}
	}

	// 4. 定义用户数据
	const usersToSeed = [
		{
			email: 'admin@qq.com',
			username: 'admin',
			displayUsername: '系统管理员',
			roles: ['admin', 'employee']
		},
		{
			email: 'laoban@example.com',
			username: 'laoban',
			displayUsername: '老板',
			roles: ['boss', 'employee']
		},
		{
			email: 'zhangsan@example.com',
			username: 'zhangsan',
			displayUsername: '张三',
			roles: ['manager', 'employee']
		},
		{
			email: 'lisi@example.com',
			username: 'lisi',
			displayUsername: '李四',
			roles: ['manager', 'employee']
		},
		{
			email: 'wangwu@example.com',
			username: 'wangwu',
			displayUsername: '王五',
			roles: ['manager', 'employee']
		},
		{
			email: 'zhaoliu@example.com',
			username: 'zhaoliu',
			displayUsername: '赵六',
			roles: ['manager', 'employee']
		},
		{
			email: 'dev@example.com',
			username: 'dev',
			displayUsername: '开发人员',
			roles: ['dev', 'employee']
		},
		{ email: 'emp1@example.com', username: 'emp1', displayUsername: '员工甲', roles: ['employee'] },
		{ email: 'emp2@example.com', username: 'emp2', displayUsername: '员工乙', roles: ['employee'] },
		{ email: 'emp3@example.com', username: 'emp3', displayUsername: '员工丙', roles: ['employee'] },
		{ email: 'emp4@example.com', username: 'emp4', displayUsername: '员工丁', roles: ['employee'] }
	];

	const userMap: Record<string, string> = {};

	// 5. 创建用户并分配角色
	for (const u of usersToSeed) {
		let userId: string;
		const existing = await db.query.user.findFirst({
			where: eq(schema.user.email, u.email)
		});

		if (!existing) {
			const result = await auth.api.signUpEmail({
				body: {
					email: u.email,
					password,
					name: u.displayUsername,
					username: u.username,
					displayUsername: u.displayUsername
				}
			});
			userId = result.user.id;
			logger.info(`✅ User created: ${u.displayUsername}`);
		} else {
			userId = existing.id;
			logger.info(`ℹ️ User already exists: ${u.displayUsername}`);
		}
		userMap[u.username] = userId;

		// 分配角色
		for (const roleKey of u.roles) {
			const roleId = roleIdMap[roleKey];
			const existingUserRole = await db.query.userRole.findFirst({
				where: (table, { and, eq }) => and(eq(table.userId, userId), eq(table.roleId, roleId))
			});

			if (!existingUserRole) {
				await db.insert(schema.userRole).values({
					userId,
					roleId
				});
			}
		}
	}

	// 6. 定义并创建团队
	const teamsToSeed = [
		{
			key: 'rd',
			name: { default: '研发部', zh: '研发部', en: 'Research & Development' },
			manager: 'dev',
			members: ['dev', 'emp1', 'emp2']
		},
		{
			key: 'marketing',
			name: { default: '市场部', zh: '市场部', en: 'Marketing' },
			manager: 'laoban',
			members: ['laoban', 'emp3', 'emp4']
		},
		{
			key: 'management',
			name: { default: '管理部', zh: '管理部', en: 'Management' },
			manager: 'admin',
			members: ['admin', 'zhangsan', 'lisi', 'wangwu', 'zhaoliu']
		}
	];

	for (const t of teamsToSeed) {
		let teamId: string;
		const existingTeam = await db.query.team.findFirst({
			where: (table, { sql }) => sql`${table.name}->>'en' = ${t.name.en}`
		});

		if (existingTeam) {
			teamId = existingTeam.id;
			logger.info(`ℹ️ Team already exists: ${t.name.zh}`);
		} else {
			const [inserted] = await db
				.insert(schema.team)
				.values({
					name: t.name,
					managerId: userMap[t.manager]
				})
				.returning();
			teamId = inserted.id;
			logger.info(`✅ Team created: ${t.name.zh}`);
		}

		// 添加团队成员
		for (const memberUsername of t.members) {
			const userId = userMap[memberUsername];
			const existingTeamUser = await db.query.teamUser.findFirst({
				where: (table, { and, eq }) => and(eq(table.teamId, teamId), eq(table.userId, userId))
			});

			if (!existingTeamUser) {
				await db.insert(schema.teamUser).values({
					teamId,
					userId
				});
			}
		}
	}

	logger.info('🚀 Seeding process finished!');
}
