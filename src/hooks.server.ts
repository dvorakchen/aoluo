import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import type { Handle } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { logger } from '$lib/server/logger';
import { seed } from '$lib/server/db/seed';
import { initWebSocket } from '$lib/server/websocket';
import { APIError } from 'better-auth/api';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	try {
		const session = await auth.api.getSession({ headers: event.request.headers });

		if (session) {
			event.locals.session = session.session;
			event.locals.user = session.user;
		}
	} catch (e) {
		if (e instanceof APIError) {
			// 如果是 APIError，说明是业务逻辑拦截（如 banned）
			// 我们在这里不处理，让后面的 svelteKitHandler 再次执行并正确返回 Response
			logger.debug(`APIError caught in hooks: ${e.message}`);
		} else {
			logger.error(e, 'Error in getSession hook');
		}
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

const handleLog: Handle = async ({ event, resolve }) => {
	const start = performance.now();

	// 处理请求
	const response = await resolve(event);

	const time = performance.now() - start;

	// 记录所有请求日志
	logger.info(
		{
			method: event.request.method,
			url: event.url.pathname,
			status: response.status,
			time: `${time.toFixed(2)}ms`
		},
		'Incoming Request'
	);

	return response;
};

// 全局错误捕获
export const handleError = ({ error, event }) => {
	logger.error(
		{
			err: error,
			url: event.url.pathname
		},
		'Uncaught Server Error'
	);
};

export const handle: Handle = sequence(handleLog, handleBetterAuth, handleParaglide);

await seed();

initWebSocket();
