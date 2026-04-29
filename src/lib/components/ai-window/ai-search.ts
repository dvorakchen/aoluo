import type { RxDataAiChat } from '$lib/client/websocket/model';
import { type ChatContext } from './context';

export function subscribeAiChatRx(_: ChatContext, payload: RxDataAiChat) {
	if (!payload.type) {
		return;
	}

	switch (payload.type) {
		case 'unknow':
			// context.chatList.push(
			//     thinkingComponent()
			// );
			break;

		default:
			break;
	}
}
