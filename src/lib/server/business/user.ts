import { db } from '$lib/server/db';
import { role, userRole, user } from '$lib/server/db/schema';
import { eq, count, and, ilike, type SQL, inArray, sql } from 'drizzle-orm';
import type {
	PaginationResult,
	PermissionSchema,
	PermissionValue,
	User as UserType
} from '$lib/shared';

export type UserFilter = {
	/**
	 * 用户名，登录账号，数据库里是唯一的
	 */
	username?: string;
	/**
	 * 显示名称，用户可以修改，数据库里不唯一
	 */
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

	if (filter?.username) {
		filters.push(ilike(user.username, `%${filter.username}%`));
	}
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
 * 根据用户名获取用户
 * @param username 用户名
 */
export async function getUserByUsername(usernameStr: string): Promise<UserType | null> {
	const result = await db.query.user.findFirst({
		where: eq(user.username, usernameStr)
	});
	return result ?? null;
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

/**
 * 封禁一个用户
 */
export async function banUser(username: string, reason: string): Promise<void> {
	await db
		.update(user)
		.set({ banned: true, banReason: reason, banExpires: null })
		.where(eq(user.username, username));
}

/**
 * 解禁一个用户
 */
export async function unbanUser(username: string): Promise<void> {
	await db
		.update(user)
		.set({ banned: false, banReason: null, banExpires: null })
		.where(eq(user.username, username));
}

/**
 * 入职一个用户
 */
export async function hireUser(username: string): Promise<void> {
	await db.update(user).set({ removed: false }).where(eq(user.username, username));
}

/**
 * 离职一个用户
 */
export async function resignUser(username: string): Promise<void> {
	await db.update(user).set({ removed: true }).where(eq(user.username, username));
}

/**
 * 更新用户信息
 */
export async function updateUser(
	userId: string,
	data: Partial<UserType>,
	rolesId?: string[]
): Promise<void> {
	await db.transaction(async (tx) => {
		// 1. 更新基本信息
		if (Object.keys(data).length > 0) {
			await tx.update(user).set(data).where(eq(user.id, userId));
		}

		// 2. 更新角色信息
		if (Array.isArray(rolesId)) {
			// 先删除旧的角色关联
			await tx.delete(userRole).where(eq(userRole.userId, userId));

			if (rolesId.length > 0) {
				// 获取有效的角色（防止传入不存在的 ID）
				const validRoles = await tx
					.select({ id: role.id })
					.from(role)
					.where(inArray(role.id, rolesId));

				if (validRoles.length > 0) {
					// 批量插入新的角色关联
					await tx.insert(userRole).values(
						validRoles.map((r) => ({
							userId,
							roleId: r.id
						}))
					);
				}
			}
		}
	});
}

/**
 * 手机号是否占用
 * @param phone 手机号
 * @param excludeUserId 排除的用户 ID（用于更新时排除自己）
 */
export async function isPhoneNumberTaken(phone: string, excludeUserId?: string): Promise<boolean> {
	const filters: SQL[] = [eq(user.phoneNumber, phone)];

	if (excludeUserId) {
		filters.push(sql`${user.id} <> ${excludeUserId}`);
	}

	const result = await db.query.user.findFirst({
		where: and(...filters)
	});

	return !!result;
}
