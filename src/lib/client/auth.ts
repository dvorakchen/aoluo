import { createAuthClient } from 'better-auth/svelte';
import { usernameClient, phoneNumberClient, organizationClient } from 'better-auth/client/plugins';
import { env } from '$env/dynamic/public';
import { passkeyClient } from '@better-auth/passkey/client';
import { betterAuthOrgConfig } from '../shared/permissions';

export const authClient = createAuthClient({
	baseURL: env.PUBLIC_ORIGIN,
	plugins: [
		usernameClient(),
		passkeyClient(),
		phoneNumberClient(),
		organizationClient({
			...betterAuthOrgConfig
		})
	]
});
