/// AI 对话框的上下文
///

import type { Component, ComponentProps } from 'svelte';
import UserQuestion from './user-question.svelte';
import * as utils from '$lib/shared/utils';
import Thinking from './thinking.svelte';

export class ChatContext {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public chatList: ChatBubble<Component<any>>[] = [];

	private constructor() {}

	static new(): ChatContext {
		const ctx = { chatList: [] };
		// TODO: 处理是初始化的第一条信息
		ctx.chatList = [];
		return ctx;
	}
}

export function thinking(chatContext: ChatContext) {
	const cb = ChatBubble.fromAi(Thinking, {}, true);
	cb.replacable = true;

	const list = chatContext.chatList.filter((t) => !t.replacable);
	list.push(cb);
	chatContext.chatList = list;
}

type SenderType = 'user' | 'ai';

/**
 * 单条的聊天气泡，包括用户的提问，AI 的回答
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ChatBubble<C extends Component<any, any, any>> {
	id: string = utils.uuid();
	/**
	 * 这是一个显示对话气泡样式的组件，由于AI的回答多种多样，包括工具调用、询问等各种，
	 * 都需要不同的展示效果
	 */
	View: C;
	props: ComponentProps<C>;
	sender: SenderType;
	pending: boolean;
	replacable: boolean = false;

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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static fromAi<C extends Component<any, any, any>>(
		view: C,
		props: ComponentProps<C>,
		pending: boolean
	) {
		return new ChatBubble(view, props, 'ai', pending);
	}
}
