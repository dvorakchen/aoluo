import { WebSocketServer, type WebSocket } from 'ws';
import { logger } from '$lib/server/logger';
import type { RxDataAiChat, TxDataAiChat } from '$lib/client/websocket/model';
import type { RxData, TxData } from './model';
import { setTimeout } from 'node:timers/promises';

export type WebSocketServerEnhance = WebSocketServer & {
	_initialized: boolean;
};

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

	wss.on('connection', (ws: WebSocket) => {
		logger.info('✅ WebSocket 客户端已连接');

		ws.on('message', async (raw) => {
			try {
				const message: RxData = JSON.parse(raw.toString());
				handleIncomingMessage(ws, message);
			} catch (error) {
				console.error('WebSocket 消息解析失败:', error);
			}
		});

		ws.on('close', () => logger.warn('❌ 客户端断开连接'));
		ws.on('error', (err) => logger.error(err, `WebSocket 错误`));
	});

	wss._initialized = true;
	return wss;
}

/**
 * 统一处理客户端发来的消息
 */
async function handleIncomingMessage(ws: WebSocket, message: RxData) {
	const { type, payload } = message;
	logger.debug(message, 'Received Msg');

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

/**
 * 处理和 AI 对话的逻辑
 * 
 * 所有逻辑处理完后需要发送一个：
 * ```
 * {
		type: 'ai-chat',
		payload: {
			type: 'end',
			data: null
		}
	}
 * ```

	给客户端表示 AI 回答完了你的对话
 */
async function handleAiChatMsg(ws: WebSocket, payload: TxDataAiChat) {
	const { type, data } = payload;

	switch (type) {
		case 'txt-imgs':
			{
				logger.info('txt-imgs');
				await setTimeout(2000);
				sendAiChat(ws, {
					type: 'plain',
					data: `你说的是：${data?.txt}`
				});
			}
			break;

		default: {
			ws.send(JSON.stringify(UNKNOW_RESPONSE));
			return;
		}
	}

	// 发送 end 结束
	sendAiChat(ws, {
		type: 'end',
		data: null
	});
}

function sendAiChat(ws: WebSocket, payload: RxDataAiChat) {
	const response = {
		type: 'ai-chat',
		payload
	};
	logger.debug(response, 'txt-imgs response');

	ws.send(JSON.stringify(response));
}

const UNKNOW_RESPONSE: TxData = {
	type: 'ai-chat',
	payload: {
		type: 'unknow',
		data: ''
	}
};
