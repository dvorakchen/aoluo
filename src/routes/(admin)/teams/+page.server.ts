import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPaginatedTeams } from '$lib/server/business/team';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const page = await getPaginatedTeams();

	return {
		teams: page.list
	};
};
