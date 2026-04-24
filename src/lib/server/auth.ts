import { betterAuth } from 'better-auth/minimal';
import { passkey } from '@better-auth/passkey';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { organization, username } from 'better-auth/plugins';
import { phoneNumber } from 'better-auth/plugins';
import { logger } from '$lib/server/logger';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true, autoSignIn: false },
	plugins: [
		sveltekitCookies(getRequestEvent), // make sure this is the last plugin in the array
		username({}),
		phoneNumber({
			sendOTP: ({ phoneNumber, code }) => {
				// TODO: Implement sending OTP code via SMS
				logger.debug(`Send OTP code ${code} to phone number ${phoneNumber}`);
			}
		}),
		passkey({
			authenticatorSelection: {
				authenticatorAttachment: 'cross-platform', // YubiKey 是跨平台认证器
				userVerification: 'preferred'
			}
		}),
		organization({
			dynamicAccessControl: { enabled: true }
		})
	]
});
