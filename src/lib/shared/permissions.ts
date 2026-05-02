/**
 * 这里是所有的权限
 */
export const PERMISSIONS = {
	team: {
		read: 'TEAM_READ',
		create: 'TEAM_Create',
		update: 'TEAM_Update',
		delet: 'TEAM_Delete'
	}
} as const;

/**
 * 权限值的联合类型
 */
export type PermissionValue = (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]];


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
		public all: PermissionValue[] = [],
	) {
	}

	static any(permissions: PermissionValue[]): PermissionSchema {
		return new PermissionSchema(permissions, [])
	}
	static all(permissions: PermissionValue[]): PermissionSchema {
		return new PermissionSchema([], permissions)
	}

	toJSON() {
		return {
			any: this.any,
			all: this.all
		};
	}
};
