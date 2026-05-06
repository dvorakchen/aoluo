import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { container } from 'tsyringe';
import { UserService } from '$lib/server/business/user';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = locals;

	const permissionSchema = await request.json();

	const userService = container.resolve(UserService);
	const has = await userService.hasPermissions(user!.id, permissionSchema);

	return json({
		has
	});
};
