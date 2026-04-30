import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements } from 'better-auth/plugins/admin/access';

export const statement = {
	// defaultStatements 里就包括了 user 和 session 的权限
	...defaultStatements,
	// 这里设定所有的权限
	team: ['read', 'create', 'update', 'delete']
} as const;

export const ac = createAccessControl(statement);

export const DEFAULT_ROLES = {
	/**
	 * 部门员工
	 */
	member: ac.newRole({
		team: ['read']
	}),

	/**
	 * 系统管理员
	 */
	admin: ac.newRole({
		team: statement.team
	}),

	/**
	 * 公司老板
	 */
	boss: ac.newRole({
		user: ['get'],
		team: statement.team
	}),

	/**
	 * 一个部门的部长
	 */
	manager: ac.newRole({
		team: ['update']
	})
} as const;

export type RoleKey = keyof typeof DEFAULT_ROLES;

export const ROLE: { [K in RoleKey]: K } = Object.keys(DEFAULT_ROLES).reduce((acc, key) => {
	acc[key as RoleKey] = key as RoleKey;
	return acc;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
}, {} as any);

export const betterAuthOrgConfig = {
	teams: {
		enabled: true,
		maximumTeams: 10,
		allowRemovingAllTeams: false, // 禁止删除最后一个团队
		maximumMembersPerTeam: 10 // 每个团队最多 50 人
	},
	ac,
	roles: { ...DEFAULT_ROLES }
} as const;
