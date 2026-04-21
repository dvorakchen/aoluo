export type ToastType = 'info' | 'warning' | 'error';

export type Toast = {
	id: string;
	message: string;
	type: ToastType;
	duration: number;
};

const createToastStore = () => {
	let list = $state<Toast[]>([]);

	return {
		get list() {
			return list;
		},
		add(message: string, type: ToastType = 'info', duration = 3000) {
			const id = Math.random().toString(36).substring(2, 9);
			const toast: Toast = { id, message, type, duration };
			list.push(toast);

			if (duration > 0) {
				setTimeout(() => {
					this.remove(id);
				}, duration);
			}
			return id;
		},
		remove(id: string) {
			list = list.filter((t) => t.id !== id);
		}
	};
};

export const toastStore = createToastStore();
