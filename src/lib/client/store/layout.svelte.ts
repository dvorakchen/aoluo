const createLayoutStore = () => {
	// px
	let _sidebarWidth = $state(300);

	return {
		get sidebarWidth() {
			return _sidebarWidth;
		},

		set sidebarWidth(width: number) {
			_sidebarWidth = width;
		}
	};
};

export const layoutStore = createLayoutStore();
