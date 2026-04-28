/// AI 对话框的上下文
///

import type { Component, ComponentProps } from 'svelte';
import UserQuestion from './user-question.svelte';
import Plain from './plain.svelte';

export type ChatContext = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	chatList: ChatBubble<Component<any>>[];
};

type SenderType = 'user' | 'ai';

/**
 * 单条的聊天气泡，包括用户的提问，AI 的回答
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ChatBubble<C extends Component<any, any, any>> {
	id: string = crypto.randomUUID();
	/**
	 * 这是一个显示对话气泡样式的组件，由于AI的回答多种多样，包括工具调用、询问等各种，
	 * 都需要不同的展示效果
	 */
	View: C;
	props: ComponentProps<C>;
	sender: SenderType;
	pending: boolean;

	constructor(view: C, props: ComponentProps<C>, sender: SenderType, pending: boolean) {
		this.View = view;
		this.props = props;
		this.sender = sender;
		this.pending = pending;
	}

	static fromUser(txt: string, imgs: string[]) {
		return new ChatBubble(
			UserQuestion,
			{
				txt,
				imgs
			},
			'user',
			false
		);
	}

	static fromAi(txt: string) {
		return new ChatBubble(
			Plain,
			{
				va: txt
			},
			'ai',
			false
		);
	}
}
