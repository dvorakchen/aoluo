import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { logger } from '$lib/server/logger';

export const load: LayoutServerLoad = (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	logger.debug('Admin layout load: user is logged in: ' + JSON.stringify(event.locals.user));
	return { user: event.locals.user };
};
