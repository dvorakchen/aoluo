import { defaultStatements } from 'better-auth/plugins/admin/access';

export const statement = {
	...defaultStatements,
	project: ['create', 'share', 'update', 'delete']
} as const;
