const DEFAULT_ACTIVE_MENU = 'Dashboard';

const createLayoutStore = () => {
	// px
	let _sidebarWidth = $state(300);
	let _activeMenu = $state(DEFAULT_ACTIVE_MENU);
	const _breadcrumbs = new Breadcrumbs();

	return {
		get breadcrumbs() {
			return _breadcrumbs;
		},

		get activeMenu() {
			return _activeMenu;
		},

		set activeMenu(menu: string) {
			_activeMenu = menu;
		},

		get sidebarWidth() {
			return _sidebarWidth;
		},

		set sidebarWidth(width: number) {
			_sidebarWidth = width;
		}
	};
};

class Breadcrumbs {
	constructor(private _breadcrumbs = $state<string[]>([DEFAULT_ACTIVE_MENU])) {}

	get list() {
		return this._breadcrumbs;
	}

	push(crumb: string) {
		this._breadcrumbs.push(crumb);
	}

	pop(): string | undefined {
		return this._breadcrumbs.pop();
	}

	clear() {
		this._breadcrumbs = [];
	}
}

export const layoutStore = createLayoutStore();
