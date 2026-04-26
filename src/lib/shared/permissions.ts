import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements } from 'better-auth/plugins/admin/access';

export const statement = {
	// defaultStatements 里就包括了 user 和 session 的权限
	...defaultStatements,
	project: ['create', 'get', 'update', 'delete']
} as const;

export const ac = createAccessControl(statement);

/**
 * 部门员工
 */
export const member = ac.newRole({
	project: ['create']
});

export const admin = ac.newRole({});

/**
 * 公司老板
 */
export const boss = ac.newRole({
	user: ['get'],
	project: statement.project
});

/**
 * 一个部门的部长
 */
export const owner = ac.newRole({
	project: ['create', 'update', 'delete']
});

export const betterAuthOrgConfig = {
	teams: {
		enabled: true,
		maximumTeams: 50,
		allowRemovingAllTeams: false, // 禁止删除最后一个团队
		maximumMembersPerTeam: 10 // 每个团队最多 50 人
	},
	ac,
	roles: { boss, member, owner }
} as const;
