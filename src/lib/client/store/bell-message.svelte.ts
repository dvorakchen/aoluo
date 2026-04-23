// 用于管理当前用户的未读信息

export const BellMessageType = {
	chat: 'Chat',
	todo: 'Todo'
} as const;

export type BellMessageTypeValue = (typeof BellMessageType)[keyof typeof BellMessageType];

export type ChatMessage = {
	sender: ChatMessageSender;
};

export type TodoMessage = {
	link: string;
};

export type ChatMessageSender = {
	id: string;
	username: string;
	avatar: string;
};

export class BellMessage<T = ChatMessage | TodoMessage> {
	public isRead = $state(false);

	constructor(
		public id: string,
		public text: string,
		public type: BellMessageTypeValue,
		isRead: boolean = false,
		public data: T | undefined = undefined
	) {
		this.isRead = isRead;
	}
}

const createBellMessageStore = () => {
	let _list = $state<BellMessage[]>([]);
	const _groups = $derived.by(() => {
		// 使用 Partial 确保类型安全，因为不一定每个类型都有消息
		const grouped: Partial<Record<BellMessageTypeValue, BellMessage[]>> = {};

		for (const msg of _list) {
			if (!grouped[msg.type]) {
				grouped[msg.type] = [];
			}
			// 将消息推入对应的分组
			grouped[msg.type]!.push(msg);
		}
		return grouped;
	});
	const _hasMessage = $derived(_list.length > 0);

	return {
		get list() {
			return _list;
		},

		get groups() {
			return _groups;
		},

		get hasMessage() {
			return _hasMessage;
		},

		refresh() {
			// 获取部分信息，未读信息优先
			_list = [
				new BellMessage('5t6vtv45h', '未读信息' + Math.random(), BellMessageType.chat, false, {
					sender: {
						id: '000',
						username: 'Alex',
						avatar: 'https://img.daisyui.com/images/profile/demo/1@94.webp'
					}
				}),
				new BellMessage('5t6vtv4523', '未读信息' + Math.random(), BellMessageType.chat, false, {
					sender: {
						id: '000',
						username: 'Alex',
						avatar: 'https://img.daisyui.com/images/profile/demo/1@94.webp'
					}
				}),
				new BellMessage('5t6v234h', '未读信息' + Math.random(), BellMessageType.chat, false, {
					sender: {
						id: '000',
						username: 'Alex',
						avatar: 'https://img.daisyui.com/images/profile/demo/1@94.webp'
					}
				}),
				new BellMessage('5t68568tv45h', '未读信息' + Math.random(), BellMessageType.chat, false, {
					sender: {
						id: '000',
						username: 'Alex',
						avatar: 'https://img.daisyui.com/images/profile/demo/1@94.webp'
					}
				}),
				new BellMessage('5t6hajhv45h', '未读信息' + Math.random(), BellMessageType.chat, false, {
					sender: {
						id: '000',
						username: 'Alex',
						avatar: 'https://img.daisyui.com/images/profile/demo/1@94.webp'
					}
				}),
				new BellMessage('5t6vtz5h', '未读信息' + Math.random(), BellMessageType.chat, false, {
					sender: {
						id: '000',
						username: 'Alex',
						avatar: 'https://img.daisyui.com/images/profile/demo/1@94.webp'
					}
				}),
				new BellMessage('5t6vtdfg5h', '未读信息' + Math.random(), BellMessageType.chat, false, {
					sender: {
						id: '000',
						username: 'Alex',
						avatar: 'https://img.daisyui.com/images/profile/demo/1@94.webp'
					}
				}),
				new BellMessage('5t6vtod45h', '未读信息' + Math.random(), BellMessageType.chat, false, {
					sender: {
						id: '000',
						username: 'Alex',
						avatar: 'https://img.daisyui.com/images/profile/demo/1@94.webp'
					}
				}),
				new BellMessage(
					'5t6v8d7645h',
					'你有工单要处理' + Math.random(),
					BellMessageType.todo,
					false,
					{ link: '/' }
				),
				new BellMessage('gsd905h', '你有工单要处理' + Math.random(), BellMessageType.todo, false, {
					link: '/'
				})
			];
		},

		read(id: string) {
			const msg = _list.find((t) => t.id === id);
			if (msg && !msg.isRead) {
				// TODO: 这里应该请求网络
				msg.isRead = true;
			}
		},

		readAll() {
			// TODO: 这里应该请求网络
			_list.filter((t) => !t.isRead).forEach((t) => (t.isRead = true));
		}
	};
};

export const bellMessageStore = createBellMessageStore();
