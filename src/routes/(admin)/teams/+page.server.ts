import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPaginatedTeams } from '$lib/server/business/team';
import { checkIsLoggedIn } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	const { user, session } = locals;
	if (!checkIsLoggedIn(user, session)) {
		return redirect(302, '/login');
	}

	const page = await getPaginatedTeams();

	return {
		teams: page.list
	};
};
