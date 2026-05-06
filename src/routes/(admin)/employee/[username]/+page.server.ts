import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserService } from '$lib/server/business/user';
import { logger } from '$lib/server/logger';
import { PermissionSchema } from '$lib/shared/permissions';
import { m } from '$lib/paraglide/messages';
import { container } from 'tsyringe';
import { ADMIN_USERNAME } from '$lib/shared';
import { RoleService } from '$lib/server/business/role';
import { PermissionService } from '$lib/server/business/permission';

export const load: PageServerLoad = async ({ params }) => {
	const userService = container.resolve(UserService);

	const { username } = params;
	const employee = await userService.getUserByUsername(username);

	if (!employee) {
		error(404, {
			message: m.not_found({ name: m.employee() })
		});
	}
	const roleService = container.resolve(RoleService);
	const permissionService = container.resolve(PermissionService);

	const roles = await roleService.getRolesByUser(employee.id);
	const permissions = await permissionService.getPermissionsByUserId(employee.id);

	return {
		employee,
		roles,
		permissions
	};
};

export const actions = {
	hire: async ({ locals, params }) => {
		const { user } = locals;
		const userService = container.resolve(UserService);

		if (!userService.hasPermissions(user!.id, PermissionSchema.any(['EMPLOYEE_RESIGN']))) {
			return fail(403, {
				message: m.no_permission()
			});
		}

		const username = params.username;
		await userService.hireUser(username);
	},
	resign: async ({ locals, params }) => {
		const { user } = locals;
		const userService = container.resolve(UserService);

		if (!userService.hasPermissions(user!.id, PermissionSchema.any(['EMPLOYEE_RESIGN']))) {
			return fail(403, {
				message: m.no_permission()
			});
		}

		const username = params.username;
		// 禁止管理员自己被离职
		if (user?.username === username || user?.username === ADMIN_USERNAME) {
			return fail(403, {
				message: m.no_permission()
			});
		}
		await userService.resignUser(username);
	},
	ban: async ({ locals, params }) => {
		const { user } = locals;
		const userService = container.resolve(UserService);

		if (!userService.hasPermissions(user!.id, PermissionSchema.any(['EMPLOYEE_BAN']))) {
			return fail(403, {
				message: m.no_permission()
			});
		}

		const username = params.username;
		// 禁止管理员自己被禁用
		if (user?.username === username || user?.username === ADMIN_USERNAME) {
			return fail(403, {
				message: m.no_permission()
			});
		}
		await userService.banUser(username, user?.username + '-操作');
	},
	unban: async ({ locals, params }) => {
		const { user } = locals;
		const userService = container.resolve(UserService);

		if (!userService.hasPermissions(user!.id, PermissionSchema.any(['EMPLOYEE_BAN']))) {
			return fail(403, {
				message: m.no_permission()
			});
		}

		const username = params.username;
		await userService.unbanUser(username);
	},
	update: async ({ locals, request }) => {
		const { user } = locals;
		const userService = container.resolve(UserService);

		if (!userService.hasPermissions(user!.id, PermissionSchema.any(['EMPLOYEE_UPDATE']))) {
			return fail(403, {
				message: m.no_permission()
			});
		}

		const formData = await request.formData();
		const userId = formData.get('userId')?.toString();
		if (!userId) {
			return fail(400, {
				message: m.missing_field({ name: 'userId' })
			});
		}
		const displayUsername = formData.get('displayName')?.toString()?.trim();
		const email = formData.get('email')?.toString()?.trim();
		const phoneNumber = formData.get('phone')?.toString()?.trim() ?? '';
		const roles = formData.get('roles')?.toString()?.trim();
		logger.debug({ userId, displayUsername, email, phoneNumber, roles }, 'Updating employee');

		if (!phoneNumber) {
			return fail(400, {
				message: m.field_required({ name: m.phone() })
			});
		}

		if (await userService.isPhoneNumberTaken(phoneNumber, userId)) {
			return fail(400, {
				message: m.field_taken({ name: m.phone() })
			});
		}

		await userService.updateUser(
			userId,
			{
				displayUsername,
				email,
				phoneNumber
			},
			roles ? roles.split(',') : undefined
		);

		return {
			success: true
		};
	}
} satisfies Actions;
