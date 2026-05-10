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

	// 权限检查 - 理论上修改角色的用户关联也属于 ROLE_UPDATE 权限
	if (
		!user ||
		!(await userService.hasPermissions(user.id, PermissionSchema.any(['ROLE_UPDATE'])))
	) {
		error(403, { message: m.no_permission() });
	}

	const { roleId } = params;
	const body = await request.json();
	const { userIds } = body;

	if (!roleId || !Array.isArray(userIds)) {
		error(400, { message: m.invalid_request() });
	}

	await roleService.updateRoleUsers(roleId, userIds);

	return json({ success: true });
};
