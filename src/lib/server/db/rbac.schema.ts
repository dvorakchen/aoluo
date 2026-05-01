import { relations, sql } from 'drizzle-orm';
import { pgTable, text, json, index, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';
import { DateTime } from 'luxon';
import { luxonTimestamp } from './custom-type';

/**
 * 角色表 role
 */
export const role = pgTable('role', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: json('name').$type<{ [key: string]: string }>().notNull(),
	permissions: text('permissions').array().notNull().default([]),
	createdAt: luxonTimestamp('created_at')
		.default(sql`now()`)
		.notNull(),
	updatedAt: luxonTimestamp('updated_at')
		.default(sql`now()`)
		.$onUpdate(() => DateTime.now())
		.notNull()
});

/**
 * 用户和角色关联表 user_role
 */
export const userRole = pgTable(
	'user_role',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		roleId: uuid('role_id')
			.notNull()
			.references(() => role.id, { onDelete: 'cascade' }),
		createdAt: luxonTimestamp('created_at')
			.default(sql`now()`)
			.notNull()
	},
	(table) => [
		index('user_role_userId_idx').on(table.userId),
		index('user_role_roleId_idx').on(table.roleId)
	]
);

/**
 * 团队表 team
 */
export const team = pgTable('team', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: json('name').$type<{ [key: string]: string }>().notNull(),
	managerId: text('manager_id').references(() => user.id, { onDelete: 'set null' }),
	createdAt: luxonTimestamp('created_at')
		.default(sql`now()`)
		.notNull(),
	updatedAt: luxonTimestamp('updated_at')
		.default(sql`now()`)
		.$onUpdate(() => DateTime.now())
		.notNull()
});

/**
 * 用户和团队关联表 team_user
 */
export const teamUser = pgTable(
	'team_user',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		teamId: uuid('team_id')
			.notNull()
			.references(() => team.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: luxonTimestamp('created_at')
			.default(sql`now()`)
			.notNull()
	},
	(table) => [
		index('team_user_teamId_idx').on(table.teamId),
		index('team_user_userId_idx').on(table.userId)
	]
);

// Relations ... (保持不变)
export const roleRelations = relations(role, ({ many }) => ({
	userRoles: many(userRole)
}));

export const userRoleRelations = relations(userRole, ({ one }) => ({
	user: one(user, {
		fields: [userRole.userId],
		references: [user.id]
	}),
	role: one(role, {
		fields: [userRole.roleId],
		references: [role.id]
	})
}));

export const teamRelations = relations(team, ({ one, many }) => ({
	manager: one(user, {
		fields: [team.managerId],
		references: [user.id]
	}),
	teamUsers: many(teamUser)
}));

export const teamUserRelations = relations(teamUser, ({ one }) => ({
	team: one(team, {
		fields: [teamUser.teamId],
		references: [team.id]
	}),
	user: one(user, {
		fields: [teamUser.userId],
		references: [user.id]
	})
}));

export const userRbacRelations = relations(user, ({ many }) => ({
	userRoles: many(userRole),
	teamUsers: many(teamUser),
	managedTeams: many(team)
}));
