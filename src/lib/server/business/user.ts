import { db } from '$lib/server/db';
import { role, userRole, user } from '$lib/server/db/schema';
import { eq, count, and, ilike, type SQL } from 'drizzle-orm';
import type {
	PaginationResult,
	PermissionSchema,
	PermissionValue,
	User as UserType
} from '$lib/shared';

export type UserFilter = {
	displayUsername?: string;
	email?: string;
	phone?: string;
	removed?: boolean;
	banned?: boolean;
};

/**
 * 分页获取所有用户
 * @param page 当前页码
 * @param pageSize 每页条数
 * @param filter 过滤条件
 */
export async function getPaginatedUsers(
	page: number = 1,
	pageSize: number = 10,
	filter?: UserFilter
): Promise<PaginationResult<UserType>> {
	const offset = (page - 1) * pageSize;

	const filters: SQL[] = [];

	if (filter?.displayUsername) {
		filters.push(ilike(user.displayUsername, `%${filter.displayUsername}%`));
	}
	if (filter?.email) {
		filters.push(ilike(user.email, `%${filter.email}%`));
	}
	if (filter?.phone) {
		filters.push(ilike(user.phoneNumber, `%${filter.phone}%`));
	}
	if (filter?.removed !== undefined) {
		filters.push(eq(user.removed, filter.removed));
	}
	if (filter?.banned !== undefined) {
		filters.push(eq(user.banned, filter.banned));
	}

	const where = filters.length > 0 ? and(...filters) : undefined;

	const [list, totalRes] = await Promise.all([
		db.select().from(user).where(where).limit(pageSize).offset(offset).orderBy(user.createdAt),
		db.select({ value: count() }).from(user).where(where)
	]);

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
 * 获取用户关联的所有权限
...
 */
export async function getUserPermissions(userId: string): Promise<PermissionValue[]> {
	const result = await db
		.select({
			permissions: role.permissions
		})
		.from(userRole)
		.innerJoin(role, eq(userRole.roleId, role.id))
		.where(eq(userRole.userId, userId));

	// 合并并去重权限
	const allPermissions = new Set<PermissionValue>();
	result.forEach((r) => {
		r.permissions.forEach((p) => {
			allPermissions.add(p as PermissionValue);
		});
	});

	return Array.from(allPermissions);
}

/**
 * 用户是否有权限
 * @param userId 用户 user_id
 * @param permissions 权限策略
 */
export async function hasPermissions(
	userId: string,
	permissions: PermissionSchema
): Promise<boolean> {
	const userPerms = await getUserPermissions(userId);
	const userPermSet = new Set(userPerms);

	// 检查 'all' 条件：必须满足数组中所有的权限
	if (permissions.all.length > 0) {
		const hasAll = permissions.all.every((p) => userPermSet.has(p));
		if (!hasAll) return false;
	}

	// 检查 'any' 条件：只需满足数组中任意一个权限
	if (permissions.any.length > 0) {
		const hasAny = permissions.any.some((p) => userPermSet.has(p));
		if (!hasAny) return false;
	}

	// 如果没有定义任何限制，或者所有限制都通过了，返回 true
	return true;
}

/**
 * 用户是否被封禁
 * @param userObj 用户对象或 user_id
 */
export async function userHasBeenBanned(userObj?: UserType | null | string): Promise<boolean> {
	let u: UserType | undefined | null;

	if (typeof userObj === 'string') {
		u = await db.query.user.findFirst({
			where: eq(user.id, userObj)
		});
	} else {
		u = userObj;
	}

	if (u?.banned) {
		const banExpired = u.banExpires && new Date(u.banExpires) < new Date();
		if (banExpired) {
			await db.update(user).set({ banned: false }).where(eq(user.id, u.id));
			return false;
		}
		return true;
	}

	return false;
}
