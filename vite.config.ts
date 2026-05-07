import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';
import { WebSocketServer } from 'ws';
import type { ViteDevServer } from 'vite';

const webSocketServer = {
	name: 'vite-plugin-websocket',
	configureServer: (server: ViteDevServer) => {
		const http = server.httpServer;
		if (!http) return;

		// 1. 创建独立 WS 服务
		const wss = new WebSocketServer({ noServer: true });
		global.wss = wss;

		// 2. 手动分流 upgrade 请求
		http.on('upgrade', (request, socket, head) => {
			const url = new URL(request.url || '', `http://${request.headers.host}`);
			if (url.pathname === '/ws') {
				wss.handleUpgrade(request, socket, head, (ws) => {
					wss.emit('connection', ws, request);
				});
			}
		});
	}
};

const tsyringePolyfill = {
	name: 'tsyringe-polyfill',
	transform(code: string, id: string) {
		if (id.includes('tsyringe')) {
			return {
				code: `import 'reflect-metadata';\n${code}`,
				map: null
			};
		}
	}
};

export default defineConfig({
	plugins: [
		tsyringePolyfill,
		tailwindcss(),
		sveltekit(),
		webSocketServer,
		paraglideVitePlugin({ project: './project.inlang', outdir: './src/lib/paraglide' })
	],
	ssr: {
		noExternal: ['tsyringe']
	},
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
