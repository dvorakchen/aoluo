import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	banUser,
	getUserByUsername,
	hasPermissions,
	hireUser,
	isPhoneNumberTaken,
	resignUser,
	unbanUser,
	updateUser
} from '$lib/server/business/user';
import { checkIsLoggedIn } from '$lib/server/auth';
import { getPermissionsByUserId } from '$lib/server/business/permission';
import { getRolesByUser } from '$lib/server/business/role';
import { logger } from '$lib/server/logger';
import { PermissionSchema } from '$lib/shared/permissions';
import { m } from '$lib/paraglide/messages';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { user, session } = locals;
	if (!checkIsLoggedIn(user, session)) {
		return redirect(302, '/login');
	}

	const { username } = params;
	const employee = await getUserByUsername(username);

	if (!employee) {
		error(404, {
			message: m.not_found({ name: m.employee() })
		});
	}

	const roles = await getRolesByUser(employee.id);
	const permissions = await getPermissionsByUserId(employee.id);

	return {
		employee,
		roles,
		permissions
	};
};

export const actions = {
	hire: async ({ locals, params }) => {
		const { user, session } = locals;
		if (!checkIsLoggedIn(user, session)) {
			return redirect(302, '/login');
		}

		if (!hasPermissions(user!.id, PermissionSchema.any(['EMPLOYEE_RESIGN']))) {
			return fail(403, {
				message: m.no_permission()
			});
		}

		const username = params.username;
		await hireUser(username);
	},
	resign: async ({ locals, params }) => {
		const { user, session } = locals;
		if (!checkIsLoggedIn(user, session)) {
			return redirect(302, '/login');
		}

		if (!hasPermissions(user!.id, PermissionSchema.any(['EMPLOYEE_RESIGN']))) {
			return fail(403, {
				message: m.no_permission()
			});
		}

		const username = params.username;
		await resignUser(username);
	},
	ban: async ({ locals, params }) => {
		const { user, session } = locals;
		if (!checkIsLoggedIn(user, session)) {
			return redirect(302, '/login');
		}

		if (!hasPermissions(user!.id, PermissionSchema.any(['EMPLOYEE_BAN']))) {
			return fail(403, {
				message: m.no_permission()
			});
		}

		const username = params.username;
		await banUser(username, user?.username + '-操作');
	},
	unban: async ({ locals, params }) => {
		const { user, session } = locals;
		if (!checkIsLoggedIn(user, session)) {
			return redirect(302, '/login');
		}

		if (!hasPermissions(user!.id, PermissionSchema.any(['EMPLOYEE_BAN']))) {
			return fail(403, {
				message: m.no_permission()
			});
		}

		const username = params.username;
		await unbanUser(username);
	},
	update: async ({ locals, request }) => {
		const { user, session } = locals;
		if (!checkIsLoggedIn(user, session)) {
			return redirect(302, '/login');
		}

		if (!hasPermissions(user!.id, PermissionSchema.any(['EMPLOYEE_UPDATE']))) {
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

		if (await isPhoneNumberTaken(phoneNumber, userId)) {
			return fail(400, {
				message: m.field_taken({ name: m.phone() })
			});
		}

		await updateUser(
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
