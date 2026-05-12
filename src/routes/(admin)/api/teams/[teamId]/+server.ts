import { TeamService } from '$lib/server/business/team';
import { UserService } from '$lib/server/business/user';
import { PermissionSchema } from '$lib/shared/permissions';
import { m } from '$lib/paraglide/messages';
import { error, json } from '@sveltejs/kit';
import { container } from 'tsyringe';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { user } = locals;
	const userService = container.resolve(UserService);

	if (
		!user ||
		!(await userService.hasPermissions(user.id, PermissionSchema.any(['TEAM_DELETE'])))
	) {
		error(403, { message: m.no_permission() });
	}

	const teamId = params.teamId;

	if (!teamId) {
		error(400, { message: m.invalid_request() });
	}

	const teamService = container.resolve(TeamService);
	await teamService.deleteTeam(teamId);

	return json({ success: true });
};
