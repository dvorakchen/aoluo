import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getTeamById, getTeamMembers } from '$lib/server/business/team';
import { m } from '$lib/paraglide/messages';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	const team = await getTeamById(params.id);

	if (!team) {
		return error(404, {
			message: m.not_found({ name: m.team() }),
			hint: m.check_id_correct()
		});
	}

	const members = await getTeamMembers(team.id);

	return {
		team,
		members
	};
};
