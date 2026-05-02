import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPaginatedUsers } from '$lib/server/business/user';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const page = await getPaginatedUsers();

	return {
		users: page.list
	};
};
