import { WebSocketServer, type WebSocket } from 'ws';
import type { WsMessage } from '$lib/shared';
import { logger } from '$lib/server/logger';

/**
 * 启动 WebSocket 服务器逻辑
 * @param server HTTP 服务器实例
 */
export function initWebSocket(port: number) {
	const wss = new WebSocketServer({ port });

	// 挂载到全局，供 SvelteKit 后端调用
	global.wss = wss;

	wss.on('connection', (ws: WebSocket) => {
		logger.info('✅ WebSocket 客户端已连接');

		ws.on('message', (raw) => {
			try {
				const message: WsMessage = JSON.parse(raw.toString());
				handleIncomingMessage(ws, message);
			} catch (error) {
				console.error('WebSocket 消息解析失败:', error);
			}
		});

		ws.on('close', () => logger.warn('❌ 客户端断开连接'));
		ws.on('error', (err) => logger.error(err, `WebSocket 错误`));
	});

	return wss;
}

/**
 * 统一处理客户端发来的消息
 */
function handleIncomingMessage(ws: WebSocket, message: WsMessage) {
	const { type, payload } = message;

	switch (type) {
		case 'ai-chat':
			{
				// 这里可以接入真实的 AI 逻辑
				logger.info('收到 AI 聊天内容: %s', payload.data.txt);

				// 模拟一个简单的回显回复
				const response: WsMessage = {
					type: 'ai-chat',
					payload: {
						type: 'txt-img',
						data: {
							txt: `已收到：${payload.data.txt}。这是来自服务器的消息。`,
							img: ''
						}
					}
				};

				ws.send(JSON.stringify(response));
			}
			break;

		default:
			console.warn('收到未定义的业务类型:', type);
	}
}
