import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { username } from 'better-auth/plugins';
import { phoneNumber } from 'better-auth/plugins';
import { logger } from '$lib/server/logger';
import { env as pubenv } from '$env/dynamic/public';
import type { Session, User } from '$lib/shared';
import { DateTime } from 'luxon';

const baseURL = pubenv.PUBLIC_ORIGIN;
console.log(`[Better Auth] Initializing baseURL: ${baseURL}`);

export const auth = betterAuth({
	baseURL,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true, autoSignIn: false },
	plugins: [
		sveltekitCookies(getRequestEvent), // make sure this is the last plugin in the array
		username({}),
		phoneNumber({
			sendOTP: ({ phoneNumber, code }) => {
				// TODO: Implement sending OTP code via SMS
				logger.debug(`Send OTP code %s to phone number %s`, code, phoneNumber);
			}
		})
		// 不使用 better-ath 的 orginization 插件，不满足要求
	]
});

/**
 * 检查是否登录，是否过期，
 * 会在 请求函数中使用
 * @param user locals.user
 * @param session locals.session
 * @returns
 */
export function checkIsLoggedIn(user?: User | null, session?: Session | null): boolean {
	if (!user || !session) {
		return false;
	}

	return DateTime.fromJSDate(session.expiresAt) > DateTime.now();
}
