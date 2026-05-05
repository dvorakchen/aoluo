import { m } from '$lib/paraglide/messages';

/**
 * 这里是所有的权限
 */
export const PERMISSIONS = {
	/**
	 * 团队管理
	 */
	team: {
		read: 'TEAM_READ',
		create: 'TEAM_CREATE',
		update: 'TEAM_UPDATE',
		delete: 'TEAM_DELETE'
	},
	/**
	 * 员工管理
	 */
	employee: {
		read: 'EMPLOYEE_READ',
		create: 'EMPLOYEE_CREATE',
		update: 'EMPLOYEE_UPDATE',
		delete: 'EMPLOYEE_DELETE',
		/**
		 * 可以让员工禁止登录系统
		 */
		ban: 'EMPLOYEE_BAN',
		/**
		 * 可以让员工离职，禁止登录系统
		 */
		resign: 'EMPLOYEE_RESIGN'
	}
} as const;

/**
 * 权限值的联合类型
 */
export type PermissionValue = {
	[K in keyof typeof PERMISSIONS]: (typeof PERMISSIONS)[K][keyof (typeof PERMISSIONS)[K]];
}[keyof typeof PERMISSIONS];

/**
 * 权限对应的 i18n 标签
 */
export const PERMISSION_LABELS: Record<PermissionValue, () => string> = {
	[PERMISSIONS.team.read]: () => m.permission_team_read(),
	[PERMISSIONS.team.create]: () => m.permission_team_create(),
	[PERMISSIONS.team.update]: () => m.permission_team_update(),
	[PERMISSIONS.team.delete]: () => m.permission_team_delete(),
	[PERMISSIONS.employee.read]: () => m.permission_employee_read(),
	[PERMISSIONS.employee.create]: () => m.permission_employee_create(),
	[PERMISSIONS.employee.update]: () => m.permission_employee_update(),
	[PERMISSIONS.employee.delete]: () => m.permission_employee_delete(),
	[PERMISSIONS.employee.ban]: () => m.permission_employee_ban(),
	[PERMISSIONS.employee.resign]: () => m.permission_employee_resign()
};

/**
 * 获取权限的 i18n 标签
 */
export function getPermissionLabel(permission: PermissionValue): string {
	return PERMISSION_LABELS[permission]?.() ?? permission;
}

/**
 * 权限策略
 *
 * # Fields:
 *
 * - any: 只要满足数组里的一项
 * - all: 满足数组里所有的项
 *
 * # Examples:
 *
 * ```
 * // 同时满足 'TEAM_Update' 和 'TEAM_Delet' 就有权限
 * PermissionSchema.all(['TEAM_Update', 'TEAM_Delet'])
 * ```
 *
 * ```
 * // 只要有 'TEAM_Update' 或者 'TEAM_Delet' 就有权限
 * PermissionSchema.any(['TEAM_Update', 'TEAM_Delet'])
 * ```
 *
 * ```
 * // 只要有 'TEAM_Update' 或者 'TEAM_Delet'，同时满足 'TEAM_Create' 和 'TEAM_Read' 就有权限
 * PermissionSchema(['TEAM_Update', 'TEAM_Delet'], ['TEAM_Create', 'TEAM_Read'])
 * ```
 */
export class PermissionSchema {
	constructor(
		public any: PermissionValue[] = [],
		public all: PermissionValue[] = []
	) {}

	static any(permissions: PermissionValue[]): PermissionSchema {
		return new PermissionSchema(permissions, []);
	}
	static all(permissions: PermissionValue[]): PermissionSchema {
		return new PermissionSchema([], permissions);
	}

	toJSON() {
		return {
			any: this.any,
			all: this.all
		};
	}
}
