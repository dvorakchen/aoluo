import type { PageServerLoad } from './$types';
import { container } from 'tsyringe';
import { RoleService } from '$lib/server/business/role';

export const load: PageServerLoad = async () => {
	const roleService = container.resolve(RoleService);
	const roles = await roleService.getRolesWithUserCount();

	return {
		roles
	};
};
