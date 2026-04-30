import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { logger } from '$lib/server/logger';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { getUserPermissions } from '$lib/server/business/user';

export const load: LayoutServerLoad = async ({ locals, request }) => {
	const user = locals.user;
	if (!user) {
		return redirect(302, '/login');
	}
	logger.debug(locals.user, 'Admin layout load: user is logged in');

	const userTeams = await db.query.teamMember.findMany({
		where: eq(schema.teamMember.userId, user.id),
		with: {
			team: true
		}
	});

	const teams = userTeams.map((ut) => ut.team);

	const headers = request.headers;
	const orgs = await auth.api.listOrganizations({
		headers
	});
	await auth.api.setActiveOrganization({
		body: {
			organizationId: orgs[0].id
		},
		headers
	});

	const permissions = await getUserPermissions(user.id, orgs[0].id);
	return {
		user,
		teams,
		permissions
	};
};
