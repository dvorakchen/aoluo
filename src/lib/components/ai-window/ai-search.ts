import type { RxDataAiChat } from '$lib/client/websocket/model';
import { ChatBubble, type ChatContext } from './context';

/**
 * 订阅服务端响应的 AI 聊天信息，end 除外
 */
export function subscribeAiChatRx(ctx: ChatContext, payload: RxDataAiChat) {
	if (!payload.type) {
		return;
	}

	switch (payload.type) {
		case 'plain':
			{
				ctx.chatList.push(ChatBubble.plain(payload.data ?? ''));
			}
			break;

		default:
			break;
	}
}
