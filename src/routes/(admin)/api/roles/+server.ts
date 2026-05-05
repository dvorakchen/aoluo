import { checkIsLoggedIn } from '$lib/server/auth';
import { getRoles } from '$lib/server/business/role.js';
import { json, redirect } from '@sveltejs/kit';

export const GET = async ({ locals }) => {
	const { user, session } = locals;
	if (!checkIsLoggedIn(user, session)) {
		return redirect(302, '/login');
	}

	const list = await getRoles();
	return json({ list });
};
