import { TeamService } from '$lib/server/business/team';
import { m } from '$lib/paraglide/messages';
import { error, json } from '@sveltejs/kit';
import { container } from 'tsyringe';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { teamId, managerId } = body;

	if (!teamId || !managerId) {
		error(400, m.invalid_request());
	}

	const teamService = container.resolve(TeamService);
	await teamService.updateTeamManager(teamId, managerId);

	return json({ success: true });
};
