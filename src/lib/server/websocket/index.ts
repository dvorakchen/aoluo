import { WebSocketServer, type WebSocket } from 'ws';
import { logger } from '$lib/server/logger';
import type { RxData } from './model';
import { handleAiChatMsg } from './handle_ai_chat';
import { auth } from '$lib/server/auth';
import type { User } from '$lib/shared';

export type WebSocketServerEnhance = WebSocketServer & {
	_initialized: boolean;
};

// 扩展 WebSocket 类型以存储用户信息
export type WebSocketWithUser = WebSocket & { user?: User };

/**
 * 启动 WebSocket 服务器逻辑
 * @param server HTTP 服务器实例
 */
export function initWebSocket() {
	const wss = global.wss;
	if (!wss) {
		logger.warn('❌ 没有找到 WebSocket 客户端');
		return;
	}

	if (wss._initialized) {
		return wss;
	}

	wss.on('connection', async (ws: WebSocket, request) => {
		logger.info('✅ WebSocket 客户端已连接');

		const session = await auth.api.getSession({
			headers: request.headers as HeadersInit
		});

		if (!session) {
			logger.warn('WebSocket 连接未授权');
			ws.close(1008, 'Unauthorized');
			return;
		}

		// 2. 将用户信息存入 ws 实例
		(ws as WebSocketWithUser).user = session.user;
		const wsu = ws as WebSocketWithUser;
		logger.info(`用户 ${wsu.user?.username ?? 'null'} 已连接 WebSocket`);

		wsu.on('message', async (raw) => {
			try {
				const message: RxData = JSON.parse(raw.toString());
				handleIncomingMessage(wsu, message);
			} catch (error) {
				console.error('WebSocket 消息解析失败:', error);
			}
		});

		wsu.on('close', () => logger.warn('❌ 客户端断开连接'));
		wsu.on('error', (err) => logger.error(err, `WebSocket 错误`));
	});

	wss._initialized = true;
	return wss;
}

/**
 * 统一处理客户端发来的消息
 */
async function handleIncomingMessage(ws: WebSocketWithUser, message: RxData) {
	const { type, payload } = message;
	logger.debug(ws.user, 'Websocket User');

	switch (type) {
		/* 
			用户提交的 AI 消息
		*/
		case 'ai-chat':
			{
				logger.debug(message, 'Received AI chat content');
				await handleAiChatMsg(ws, payload);
			}
			break;

		default:
			console.warn('收到未定义的业务类型:', type);
	}
}
