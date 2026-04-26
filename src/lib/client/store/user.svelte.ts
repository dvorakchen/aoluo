/**
 * 当前登录用户
 */

import type { User, Team } from '$lib/shared';

const createUserStore = () => {
	let _user: User | null = $state(null);
	let _teams: Team[] = $state([]);

	return {
		get isLoggedIn() {
			return _user !== null;
		},

		get user() {
			return _user;
		},

		get teams() {
			return _teams;
		},

		setUser(user: User, teams: Team[]) {
			_user = user;
			_teams = teams;
		},

		clear() {
			_user = null;
		}
	};
};

export const userStore = createUserStore();
