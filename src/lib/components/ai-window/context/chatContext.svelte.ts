import type { Component } from 'svelte';
import type { ChatBubble } from './chatBubble';

export class ChatContext {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public chatList: ChatBubble<Component<any>>[] = $state([]);
	/**
	 * 表示 AI 开始在处理
	 */
	private _handling = $state(false);

	private constructor() {}

	get handling() {
		return this._handling;
	}

	/**
	 * AI 开始处理
	 */
	start() {
		this._handling = true;
	}

	/**
	 * AI 结束处理
	 */
	end() {
		this._handling = false;
	}

	static new(): ChatContext {
		// TODO: 处理是初始化的第一条信息
		return new ChatContext();
	}
}
