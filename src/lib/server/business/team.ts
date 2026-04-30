import { db } from '$lib/server/db';
import { team, user, teamMember } from '$lib/server/db/schema';
import { count, eq, sql } from 'drizzle-orm';
import type { PaginationResult, TeamWithManager, User } from '$lib/shared';

/**
 * 分页获取所有团队（包含负责人信息和人数）
 * @param page 当前页码
 * @param pageSize 每页条数
 */
export async function getPaginatedTeams(
	page: number = 1,
	pageSize: number = 10
): Promise<PaginationResult<TeamWithManager>> {
	const offset = (page - 1) * pageSize;

	// 使用子查询或在主查询中进行聚合以获取人数
	const [rawList, totalRes] = await Promise.all([
		db
			.select({
				team: team,
				manager: user,
				memberCount: sql<number>`count(${teamMember.id})`.mapWith(Number)
			})
			.from(team)
			.leftJoin(user, eq(team.managerId, user.id))
			.leftJoin(teamMember, eq(team.id, teamMember.teamId))
			.groupBy(team.id, user.id)
			.limit(pageSize)
			.offset(offset)
			.orderBy(team.createdAt),
		db.select({ value: count() }).from(team)
	]);

	const list: TeamWithManager[] = rawList.map((item) => ({
		...item.team,
		manager: item.manager,
		memberCount: item.memberCount
	}));

	const total = totalRes[0].value;

	return {
		list,
		pagination: {
			page,
			pageSize,
			total,
			totalPages: Math.ceil(total / pageSize)
		}
	};
}

/**
 * 根据 ID 获取团队详情（包含负责人信息和人数）
 * @param id 团队 ID
 */
export async function getTeamById(id: string): Promise<TeamWithManager | null> {
	const result = await db
		.select({
			team: team,
			manager: user,
			memberCount: sql<number>`count(${teamMember.id})`.mapWith(Number)
		})
		.from(team)
		.leftJoin(user, eq(team.managerId, user.id))
		.leftJoin(teamMember, eq(team.id, teamMember.teamId))
		.where(eq(team.id, id))
		.groupBy(team.id, user.id)
		.limit(1);

	if (result.length === 0) return null;

	return {
		...result[0].team,
		manager: result[0].manager,
		memberCount: result[0].memberCount
	};
}

/**
 * 获取团队下的所有成员
 * @param teamId 团队 ID
 */
export async function getTeamMembers(teamId: string): Promise<User[]> {
	const result = await db
		.select({
			user: user
		})
		.from(teamMember)
		.innerJoin(user, eq(teamMember.userId, user.id))
		.where(eq(teamMember.teamId, teamId));

	return result.map((r) => r.user);
}
