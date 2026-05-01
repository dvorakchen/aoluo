import { createAuthClient } from 'better-auth/svelte';
import { usernameClient, phoneNumberClient } from 'better-auth/client/plugins';
import { env } from '$env/dynamic/public';

export const authClient = createAuthClient({
	baseURL: env.PUBLIC_ORIGIN,
	plugins: [usernameClient(), phoneNumberClient()]
});
