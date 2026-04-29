import { type WebSocket } from 'ws';
import { logger } from '$lib/server/logger';
import type { TxDataAiChat } from '$lib/client/websocket/model';
import type { RxData, TxData } from './model';

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

	return wss;
}

/**
 * 统一处理客户端发来的消息
 */
function handleIncomingMessage(ws: WebSocket, message: RxData) {
	const { type, payload } = message;

	let response: TxData;

	switch (type) {
		/* 
			用户提交的 AI 消息
		*/
		case 'ai-chat':
			{
				logger.info(message, 'Received AI chat content');
				response = handleAiChatMsg(payload);
				logger.debug(response);
			}
			break;

		default:
			console.warn('收到未定义的业务类型:', type);
	}

	response ??= {
		type: 'ai-chat',
		payload: {
			type: 'unknow',
			data: ''
		}
	};
	ws.send(JSON.stringify(response));
}

function handleAiChatMsg(payload: TxDataAiChat): TxData {
	const { type /* data*/ } = payload;

	switch (type) {
		case 'txt-imgs':
			{
				// TODO: handle txt
			}
			break;

		default:
			break;
	}
	// 这里可以接入真实的 AI 逻辑

	// 模拟一个简单的回显回复
	const response: TxData = UNKNOW_RESPONSE;

	return response;
}

const UNKNOW_RESPONSE: TxData = {
	type: 'ai-chat',
	payload: {
		type: 'unknow',
		data: ''
	}
};
