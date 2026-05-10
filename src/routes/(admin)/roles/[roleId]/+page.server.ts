import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { container } from 'tsyringe';
import { RoleService } from '$lib/server/business/role';
import { UserService } from '$lib/server/business/user';
import { m } from '$lib/paraglide/messages';

export const load: PageServerLoad = async ({ params }) => {
	const roleService = container.resolve(RoleService);
	const userService = container.resolve(UserService);

	const { roleId } = params;
	const role = await roleService.getRoleById(roleId);

	if (!role) {
		error(404, {
			message: m.not_found({ name: m.role() })
		});
	}

	const members = await userService.getUsersByRoleId(roleId);

	return {
		role,
		members
	};
};
