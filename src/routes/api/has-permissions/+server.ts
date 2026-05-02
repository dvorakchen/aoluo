import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkIsLoggedIn } from '$lib/server/auth';
import { hasPermissions } from '$lib/server/business/user';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user, session } = locals;
	if (!checkIsLoggedIn(user, session)) {
		return redirect(302, '/login');
	}

	const permissionSchema = await request.json();

	const has = await hasPermissions(user!.id, permissionSchema);

	return json({
		has
	});
};
