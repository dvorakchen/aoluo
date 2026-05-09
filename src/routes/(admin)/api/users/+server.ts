import { UserService } from '$lib/server/business/user';
import { json } from '@sveltejs/kit';
import { container } from 'tsyringe';

/**
 * 一般用分页查用户会用这个API
 * @param param0
 * @returns
 */
export const GET = async ({ url }) => {
	let page = parseInt(url.searchParams.get('page') ?? '1');
	page = isNaN(page) ? 1 : page;
	const removed = url.searchParams.get('removed');
	const banned = url.searchParams.get('banned');

	const userService = container.resolve(UserService);
	const list = await userService.getPaginatedUsers(page, 10, {
		banned: banned === null ? undefined : !!banned,
		removed: removed === null ? undefined : !!removed
	});
	return json(list);
};

/**
 * 也是分页查用户但是 POST，能否传递更多参数
 *
 * '''
 *  {
 *      excludes: [] // 排除的用户数组
 *  }
 * '''
 *
 */
export const POST = async ({ url, request }) => {
	let page = parseInt(url.searchParams.get('page') ?? '1');
	page = isNaN(page) ? 1 : page;
	const removed = url.searchParams.get('removed');
	const banned = url.searchParams.get('banned');

	const body = await request.json();
	const excludes = body.excludes ?? [];

	const userService = container.resolve(UserService);
	const list = await userService.getPaginatedUsers(page, 10, {
		banned: banned === null ? undefined : !!banned,
		removed: removed === null ? undefined : !!removed,
		excludes
	});
	return json(list);
};
