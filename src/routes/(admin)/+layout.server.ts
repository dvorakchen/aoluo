import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { logger } from '$lib/server/logger';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	logger.debug(event.locals.user, 'Admin layout load: user is logged in');

	const userTeams = await db.query.teamMember.findMany({
		where: eq(schema.teamMember.userId, event.locals.user.id),
		with: {
			team: true
		}
	});

	const teams = userTeams.map((ut) => ut.team);

	return {
		user: event.locals.user,
		teams
	};
};
