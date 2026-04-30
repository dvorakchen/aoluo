import type { auth } from '$lib/server/auth';
import { type InferSelectModel } from 'drizzle-orm';
import type * as schema from '../server/db/schema';

export * from './permissions';

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;

export type Team = InferSelectModel<typeof schema.team>;
export type Organization = InferSelectModel<typeof schema.organization>;

export type TeamWithManager = Team & {
	manager: User | null;
	memberCount: number;
};

export interface PaginationResult<T> {
	list: T[];
	pagination: {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	};
}

export const NO_ASSIGNED_TEAM = '未分配Team';
