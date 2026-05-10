import { RoleService } from '$lib/server/business/role';
import { UserService } from '$lib/server/business/user';
import { PermissionSchema } from '$lib/shared/permissions';
import { m } from '$lib/paraglide/messages';
import { json, error } from '@sveltejs/kit';
import { container } from 'tsyringe';

export const PUT = async ({ params, request, locals }) => {
	const { user } = locals;
	const userService = container.resolve(UserService);
	const roleService = container.resolve(RoleService);

	if (
		!user ||
		!(await userService.hasPermissions(user.id, PermissionSchema.any(['ROLE_UPDATE'])))
	) {
		error(403, { message: m.no_permission() });
	}

	const { roleId } = params;
	const body = await request.json();
	const { permissions } = body;

	if (!roleId || !permissions) {
		error(400, { message: m.invalid_request() });
	}

	await roleService.updateRole(roleId, { permissions });

	return json({ success: true });
};

export const DELETE = async ({ params, locals }) => {
	const { user } = locals;
	const userService = container.resolve(UserService);
	const roleService = container.resolve(RoleService);

	if (
		!user ||
		!(await userService.hasPermissions(user.id, PermissionSchema.any(['ROLE_DELETE'])))
	) {
		error(403, { message: m.no_permission() });
	}

	const { roleId } = params;

	if (!roleId) {
		error(400, { message: m.invalid_request() });
	}

	await roleService.deleteRole(roleId);

	return json({ success: true });
};
