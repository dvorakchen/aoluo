import type { LayoutServerLoad } from './$types';
import { container } from 'tsyringe';
import { UserService } from '$lib/server/business/user';
import { checkIsLoggedIn } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;
	const session = locals.session;
	if (!checkIsLoggedIn(user, session)) {
		return redirect(302, '/login');
	}

	const userService = container.resolve(UserService);
	const userTeams = await userService.getUserDetail(user!.id, true);

	const teams = userTeams.map((ut) => ut.team);

	return {
		user: user!,
		teams
	};
};
