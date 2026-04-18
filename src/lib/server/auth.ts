import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { username } from 'better-auth/plugins';
import { passkey } from '@better-auth/passkey';
import { phoneNumber } from 'better-auth/plugins';
import { logger } from '$lib/server/logger';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true },
	plugins: [
		sveltekitCookies(getRequestEvent), // make sure this is the last plugin in the array
		username(),
		passkey(),
		phoneNumber({
			sendOTP: ({ phoneNumber, code }, _) => {
				// TODO: Implement sending OTP code via SMS
				logger.debug(`Send OTP code ${code} to phone number ${phoneNumber}`);
			}
		})
	]
});
