import pino from 'pino';
import { dev } from '$app/environment';

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