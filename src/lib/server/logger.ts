import pino from 'pino';
import { dev } from '$app/environment';

// const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export const logger = pino({
	level: dev ? 'debug' : 'info',
	...(dev && {
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'SYS:standard'
			}
		}
	})
});
