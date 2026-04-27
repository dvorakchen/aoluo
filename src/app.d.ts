import type { User, Session } from '$lib/shared';
import type { WebSocketServer } from 'ws';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user?: User;
			session?: Session;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// 扩展 globalThis
	var wss: WebSocketServer | undefined;
}

export {};
