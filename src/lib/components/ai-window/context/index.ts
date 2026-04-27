/// AI 对话框的上下文
///

import type { Component } from 'svelte';

export type ChatContext = {
	chatList: ChatBubble[];
};

/**
 * 单条的聊天气泡，包括用户的提问，AI 的回答
 */
export type ChatBubble = {
	id: string;
	/**
	 * 这是一个显示对话气泡样式的组件，由于AI的回答多种多样，包括工具调用、询问等各种，
	 * 都需要不同的展示效果
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	View: Component<any>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	props: any;
	sender: 'user' | 'ai';
	pending: boolean;
};
