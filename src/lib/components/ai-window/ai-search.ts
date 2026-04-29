import type { RxDataAiChat } from '$lib/client/websocket/model';
import { ChatBubble, type ChatContext } from './context';

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
