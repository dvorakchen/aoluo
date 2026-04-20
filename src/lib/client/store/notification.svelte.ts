export type Notification = {
	text: string;
	type: 'info' | 'warning';
};

const createNotificationStore = () => {
	const list = $state<Notification[]>([]);

	return {
		get list() {
			return list;
		},

		add(notification: Notification) {
			if (list.some((n) => n.text === notification.text)) {
				return;
			}
			list.push({ ...notification });
		},
		remove(text: string) {
			const index = list.findIndex((n) => n.text === text);
			if (index !== -1) {
				list.splice(index, 1);
			}
		}
	};
};

export const notificationStore = createNotificationStore();
