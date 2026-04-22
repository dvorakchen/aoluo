/**
 * 当前登录用户
 */

import { type User } from '$lib/shared';

const createUserStore = () => {
	let _user: User | null = $state(null);

	return {
		get isLoggedIn() {
			return _user !== null;
		},

		get user() {
			return _user;
		},

		setUser(user: User) {
			_user = user;
		},

		clear() {
			_user = null;
		}
	};
};

export const userStore = createUserStore();
