import type { User, Session } from '$lib/shared';
import type { WebSocketServerEnhance } from '$lib/server/websocket';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user?: User;
			session?: Session;
		}

		interface Error {
			hint?: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// 扩展 globalThis
	var wss: WebSocketServerEnhance | undefined;
}

export {};
