import type { PageServerLoad } from './$types';
import { logger } from '$lib/server/logger';
import { QUERY_FILTER_CHECKABLE_VALUE } from '$lib/shared';
import { container } from 'tsyringe';
import { UserService } from '$lib/server/business/user';

export const load: PageServerLoad = async ({ url }) => {
	const pageNum = parseInt(url.searchParams.get('page') ?? '1');
	const pageSize = parseInt(url.searchParams.get('pageSize') ?? '10');
	const displayUsername = url.searchParams.get('displayusername') ?? undefined;
	const email = url.searchParams.get('email') ?? undefined;
	const phone = url.searchParams.get('phone') ?? undefined;
	const removed = url.searchParams.get('removed') ?? undefined;
	const banned = url.searchParams.get('banned') ?? undefined;

	const filter = {
		displayUsername,
		email,
		phone,
		removed: removed === undefined ? undefined : removed === QUERY_FILTER_CHECKABLE_VALUE.on,
		banned: banned === undefined ? undefined : banned === QUERY_FILTER_CHECKABLE_VALUE.on
	};

	logger.debug(filter, 'User filter');

	const userService = container.resolve(UserService);
	const page = await userService.getPaginatedUsers(pageNum, pageSize, filter);

	return {
		users: page.list,
		pagination: page.pagination
	};
};
