import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export const logger = pino({
	level: isDev ? 'debug' : 'info',
	...(isDev && {
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'SYS:standard'
			}
		}
	})
});

import { singleton } from 'tsyringe';

@singleton() // 声明为全局单例，整个应用只 new 一次
export class LogService {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	info: pino.LogFn = (...args: [any, ...any[]]) => (logger.info as any)(...args);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	debug: pino.LogFn = (...args: [any, ...any[]]) => (logger.debug as any)(...args);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error: pino.LogFn = (...args: [any, ...any[]]) => (logger.error as any)(...args);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	warn: pino.LogFn = (...args: [any, ...any[]]) => (logger.warn as any)(...args);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fatal: pino.LogFn = (...args: [any, ...any[]]) => (logger.fatal as any)(...args);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	trace: pino.LogFn = (...args: [any, ...any[]]) => (logger.trace as any)(...args);
}
