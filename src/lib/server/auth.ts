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
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { eq } from 'drizzle-orm';
import { user as userSchema } from '$lib/server/db/schema';
import { m } from '$lib/paraglide/messages';
import { toDateTime } from '$lib/shared/utils';
import { container } from 'tsyringe';
import { UserService } from '$lib/server/business/user';

const baseURL = pubenv.PUBLIC_ORIGIN;
console.log(`[Better Auth] Initializing baseURL: ${baseURL}`);

export const auth = betterAuth({
	baseURL,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true, autoSignIn: false },
	plugins: [
		username({}),
		phoneNumber({
			sendOTP: ({ phoneNumber, code }) => {
				// TODO: Implement sending OTP code via SMS
				logger.debug(`Send OTP code %s to phone number %s`, code, phoneNumber);
			}
		}),
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
		// 不使用 better-ath 的 orginization 插件，不满足要求
	],
	user: {
		additionalFields: {
			banned: {
				type: 'boolean',
				required: false,
				defaultValue: false,
				input: false // 用户不可自己设置
			},
			banReason: {
				type: 'string',
				required: false,
				defaultValue: ''
			},
			banExpires: {
				type: 'date',
				required: false,
				defaultValue: () => new Date() // 默认值为 1970-01-01T00:00:00.000Z，表示永不过期
			},
			//离职员工
			removed: {
				type: 'boolean',
				required: false,
				defaultValue: false,
				input: false
			}
		}
	},
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			// 拦截登录相关的端点
			const userService = container.resolve(UserService);
			if (ctx.path === '/sign-in/email' || ctx.path === '/sign-in/username') {
				// 查询用户是否被 ban（需要根据 email/username 查用户）
				const email = ctx.body?.email;
				const username = ctx.body?.username;

				// 根据 email 或 username 查找用户（需要用你的 ORM 查询）
				const user = await db.query.user.findFirst({
					where: email ? eq(userSchema.email, email) : eq(userSchema.username, username)
				});
				// 检查封禁状态

				if (await userService.userHasBeenBanned(user)) {
					throw new APIError('FORBIDDEN', {
						message: m.account_banned({ reason: user?.banReason || m.no_reason() })
					});
				}
			}

			if (ctx.path === '/get-session') {
				// 从 cookie 中获取 session token
				const sessionCookieToken = await ctx.getSignedCookie(
					ctx.context.authCookies.sessionToken.name,
					ctx.context.secret
				);

				if (!sessionCookieToken) {
					return; // 没有 session，让 Better Auth 正常处理
				}

				// 查询 session 和 user 信息
				const session = await ctx.context.internalAdapter.findSession(sessionCookieToken);

				if (await userService.userHasBeenBanned(session?.user?.id)) {
					ctx.setCookie(ctx.context.authCookies.sessionToken.name, '', {
						maxAge: 0,
						path: '/'
					});

					const unbanDate = session?.user.banExpires
						? toDateTime(session.user.banExpires)
						: m.forever();

					throw new APIError('FORBIDDEN', {
						message:
							m.account_banned({ reason: session?.user.banReason || m.no_reason() }) +
							`, ${m.unban_time()}: ${unbanDate}`
					});
				}
			}
		})
	}
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
