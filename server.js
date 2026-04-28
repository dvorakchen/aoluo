import { createServer } from 'http';
import { WebSocketServer } from 'ws';

console.log(`\n🔍 正在检查环境配置...`);
console.log(`📂 当前运行目录: ${process.cwd()}`);

console.log(
	`🔑 ADMIN_DATABASE_URL 是否存在: ${process.env.ADMIN_DATABASE_URL ? process.env.ADMIN_DATABASE_URL : '否'}`
);
console.log(
	`🔑 PUBLIC_ORIGIN 是否存在: ${process.env.PUBLIC_ORIGIN ? process.env.PUBLIC_ORIGIN : '否'}`
);

// --- 1. 环境与基础准备 ---
const listenHost = '0.0.0.0';
const origin = process.env.PUBLIC_ORIGIN || 'http://localhost:3000';
let listenPort = process.env.PORT || 3000;

// --- 2. 提前创建服务器实例 ---
// 先创建一个空的请求监听器，等 handler 加载后再填入
let svelteHandler;
const server = createServer((req, res) => {
	if (svelteHandler) {
		svelteHandler(req, res);
	} else {
		res.writeHead(503);
		res.end('Server is starting...');
	}
});

// --- 3. 初始化 WebSocket ---
// 必须在 import handler 之前设置好 global.wss
const wss = new WebSocketServer({ server, path: '/ws' });
global.wss = wss;
console.log('✅ WebSocket Server 实例已准备就绪 (global.wss)');

// --- 4. 动态导入 SvelteKit Handler ---
// 这一步会触发 hooks.server.ts 的执行
const { handler } = await import('./build/handler.js');
svelteHandler = handler;
console.log('✅ SvelteKit Handler 已加载');

// --- 5. 启动监听 ---
server.listen(listenPort, listenHost, () => {
	console.log(`\n🚀 Server is running on http://${listenHost}:${listenPort}`);
	console.log(`🌍 Public Origin: ${origin}`);
	console.log(`✅ WebSocket support enabled on /ws\n`);
});
