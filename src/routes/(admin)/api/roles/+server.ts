import { RoleService } from '$lib/server/business/role';
import { json } from '@sveltejs/kit';
import { container } from 'tsyringe';

export const GET = async () => {
	const roleService = container.resolve(RoleService);
	const list = await roleService.getRoles();
	return json({ list });
};
