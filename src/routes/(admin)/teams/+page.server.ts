import type { PageServerLoad } from './$types';
import { TeamService } from '$lib/server/business/team';
import { container } from 'tsyringe';

export const load: PageServerLoad = async () => {
	const teamService = container.resolve(TeamService);
	const page = await teamService.getPaginatedTeams();

	return {
		teams: page.list
	};
};
