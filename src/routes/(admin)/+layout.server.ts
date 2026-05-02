import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		return redirect(302, '/login');
	}

	const userTeams = await db.query.teamUser.findMany({
		where: eq(schema.teamUser.userId, user.id),
		with: {
			team: true
		}
	});

	const teams = userTeams.map((ut) => ut.team);

	return {
		user,
		teams
	};
};
