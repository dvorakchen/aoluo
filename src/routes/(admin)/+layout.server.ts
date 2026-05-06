import type { LayoutServerLoad } from './$types';
import { container } from 'tsyringe';
import { UserService } from '$lib/server/business/user';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user!;

	const userService = container.resolve(UserService);
	const userTeams = await userService.getUserDetail(user.id, true);

	const teams = userTeams.map((ut) => ut.team);

	return {
		user,
		teams
	};
};
