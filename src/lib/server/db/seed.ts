import { db } from '$lib/server/db';
import { logger } from '$lib/server/logger';
import * as schema from './schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { PUBLIC_ORG_NAME, PUBLIC_ORG_SLUG } from '$env/static/public';

export async function seed() {
	logger.info('⏳ Seeding database with full company structure and roles...');

	const password = '123123123';

	// 1. 定义用户数据及角色
	const usersToSeed = [
		{
			email: 'admin@qq.com',
			username: 'admin',
			displayUsername: '系统管理员',
			orgRole: 'admin'
		},
		{
			email: 'laoban@example.com',
			username: 'laoban',
			displayUsername: '老板',
			orgRole: 'boss'
		},
		{
			email: 'zhangsan@example.com',
			username: 'zhangsan',
			displayUsername: '张三',
			orgRole: 'manager'
		},
		{ email: 'lisi@example.com', username: 'lisi', displayUsername: '李四', orgRole: 'manager' },
		{
			email: 'wangwu@example.com',
			username: 'wangwu',
			displayUsername: '王五',
			orgRole: 'manager'
		},
		{
			email: 'zhaoliu@example.com',
			username: 'zhaoliu',
			displayUsername: '赵六',
			orgRole: 'manager'
		},
		{ email: 'emp1@example.com', username: 'emp1', displayUsername: '员工甲', orgRole: 'member' },
		{ email: 'emp2@example.com', username: 'emp2', displayUsername: '员工乙', orgRole: 'member' },
		{ email: 'emp3@example.com', username: 'emp3', displayUsername: '员工丙', orgRole: 'member' },
		{ email: 'emp4@example.com', username: 'emp4', displayUsername: '员工丁', orgRole: 'member' }
	];

	const userMap: Record<string, string> = {};

	for (const u of usersToSeed) {
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
			userMap[u.username] = result.user.id;
			logger.info(`✅ User created: ${u.displayUsername}`);
		} else {
			userMap[u.username] = existing.id;
			logger.info(`ℹ️ User already exists: ${u.displayUsername}`);
		}
	}

	// 2. 确保组织存在
	const orgSlug = PUBLIC_ORG_SLUG;
	let orgId: string;
	const existingOrg = await db.query.organization.findFirst({
		where: eq(schema.organization.slug, orgSlug)
	});

	if (!existingOrg) {
		const org = await auth.api.createOrganization({
			body: {
				name: PUBLIC_ORG_NAME,
				slug: orgSlug,
				userId: userMap['admin']
			}
		});
		orgId = org.id;
		logger.info(`✅ Organization created: ${PUBLIC_ORG_NAME}`);

		// 删除自动创建的默认团队
		await db.delete(schema.team).where(eq(schema.team.organizationId, orgId));
		logger.info('🗑️ Default auto-created team removed');
	} else {
		orgId = existingOrg.id;
		logger.info(`ℹ️ Organization already exists: ${PUBLIC_ORG_NAME}`);
	}

	// 3. 为所有用户分配组织角色 (member 表)
	for (const u of usersToSeed) {
		const userId = userMap[u.username];
		const existingMember = await db.query.member.findFirst({
			where: and(eq(schema.member.organizationId, orgId), eq(schema.member.userId, userId))
		});

		if (!existingMember) {
			await db.insert(schema.member).values({
				id: crypto.randomUUID(),
				organizationId: orgId,
				userId: userId,
				role: u.orgRole,
				createdAt: new Date()
			});
			logger.info(`✅ Assigned role ${u.orgRole} to ${u.displayUsername}`);
		} else if (existingMember.role !== u.orgRole) {
			await db
				.update(schema.member)
				.set({ role: u.orgRole })
				.where(eq(schema.member.id, existingMember.id));
			logger.info(`🔄 Updated role to ${u.orgRole} for ${u.displayUsername}`);
		}
	}

	// 4. 定义部门及成员关系 (team 表)
	const teamsToSeed = [
		{ name: '老板办公室', manager: 'laoban', members: ['admin'] },
		{ name: '研发部', manager: 'zhangsan', members: ['emp1', 'emp2'] },
		{ name: '人事部', manager: 'lisi', members: ['emp3'] },
		{ name: '销售部', manager: 'wangwu', members: ['emp4'] },
		{ name: '财务部', manager: 'zhaoliu', members: [] }
	];

	for (const t of teamsToSeed) {
		let teamId: string;
		const existingTeam = await db.query.team.findFirst({
			where: eq(schema.team.name, t.name)
		});

		const managerId = userMap[t.manager];

		if (!existingTeam) {
			teamId = crypto.randomUUID();
			await db.insert(schema.team).values({
				id: teamId,
				name: t.name,
				organizationId: orgId,
				managerId: managerId,
				createdAt: new Date(),
				updatedAt: new Date()
			});
			logger.info(`✅ Team created: ${t.name} (Manager: ${t.manager})`);
		} else {
			teamId = existingTeam.id;
			await db.update(schema.team).set({ managerId: managerId }).where(eq(schema.team.id, teamId));
			logger.info(`ℹ️ Team updated: ${t.name}`);
		}

		// 5. 处理部门成员 (team_member 表)
		const allMembers = Array.from(new Set([t.manager, ...t.members]));
		for (const memberUsername of allMembers) {
			const userId = userMap[memberUsername];
			const existingTeamMember = await db.query.teamMember.findFirst({
				where: and(eq(schema.teamMember.teamId, teamId), eq(schema.teamMember.userId, userId))
			});

			if (!existingTeamMember) {
				await db.insert(schema.teamMember).values({
					id: crypto.randomUUID(),
					teamId: teamId,
					userId: userId,
					createdAt: new Date()
				});
				logger.info(`  + Member added to ${t.name}: ${memberUsername}`);
			}
		}
	}

	logger.info('🚀 Seeding process finished!');
}
