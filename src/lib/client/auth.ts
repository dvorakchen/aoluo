import { createAuthClient } from 'better-auth/svelte';
import { usernameClient, phoneNumberClient, emailOTPClient } from 'better-auth/client/plugins';
import { env } from '$env/dynamic/public';
import { passkeyClient } from '@better-auth/passkey/client';

export const authClient = createAuthClient({
	baseURL: env.PUBLIC_ORIGIN,
	plugins: [usernameClient(), passkeyClient(), phoneNumberClient()]
});
