import { TeamService } from '$lib/server/business/team';
import { m } from '$lib/paraglide/messages';
import { error, json } from '@sveltejs/kit';
import { container } from 'tsyringe';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { teamId, userIds } = body;

	if (!teamId || !Array.isArray(userIds) || userIds.length === 0) {
		error(400, m.invalid_request());
	}

	const teamService = container.resolve(TeamService);
	await teamService.removeUsersFromTeam(teamId, userIds);

	return json({ success: true });
};
