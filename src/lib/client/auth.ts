import { createAuthClient } from 'better-auth/svelte';
import { usernameClient, phoneNumberClient } from 'better-auth/client/plugins';
import { env } from '$env/dynamic/public';
import { toastStore } from '$lib/client/store/toast.svelte';

export const authClient = createAuthClient({
	baseURL: env.PUBLIC_ORIGIN,
	plugins: [usernameClient(), phoneNumberClient()],
	fetchOptions: {
		onError(ctx) {
			if (ctx.response.status === 403) {
				toastStore.add(ctx.error.message, 'error');
			}
		}
	}
});
