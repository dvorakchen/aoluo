import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { TeamService } from '$lib/server/business/team';
import { m } from '$lib/paraglide/messages';
import { container } from 'tsyringe';

export const load: PageServerLoad = async ({ params }) => {
	const teamService = container.resolve(TeamService);
	const team = await teamService.getTeamByName(params.name);

	if (!team) {
		return error(404, {
			message: m.not_found({ name: m.team() }),
			hint: m.check_id_correct()
		});
	}

	const members = await teamService.getTeamMembers(team.id);

	return {
		team,
		members
	};
};
