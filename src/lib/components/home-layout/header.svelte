<script lang="ts">
	import { layoutStore } from '$lib/client/store/layout.svelte';
	import { m } from '$lib/paraglide/messages';
	import { ListIndentDecrease, Search } from '@lucide/svelte';
	import ThemeController from '../theme-controller.svelte';
	import ChangeLang from '../change-lang.svelte';

	const menuI18n = $derived(
		`menu_${layoutStore.activeMenu.toLowerCase()}`
	) as unknown as 'menu_dashboard';

	function handleCollapsed() {
		layoutStore.sidebarWidth = layoutStore.sidebarWidth === 0 ? 300 : 0;
	}
</script>

<nav class="navbar w-full border-b border-b-base-300 bg-base-100 pt-4 pb-0 shadow-sm">
	<button aria-label="open sidebar" class="btn mb-2 btn-square btn-ghost" onclick={handleCollapsed}>
		<!-- Sidebar toggle icon -->
		<ListIndentDecrease />
	</button>
	<div class="px-4">
		<h1 class="text-2xl font-bold">
			{m[menuI18n]() || layoutStore.activeMenu}
		</h1>
		<h3>
			<div class="breadcrumbs pt-0 text-sm">
				<ul>
					{#each layoutStore.breadcrumbs.list as crumb (crumb)}
						<li>{crumb}</li>
					{/each}
				</ul>
			</div>
		</h3>
	</div>
	<div class="mr-4 mb-3 flex grow flex-row-reverse items-center gap-4">
		<ThemeController />
		<ChangeLang />
		<label class="input w-50 cursor-pointer ring-offset-2 hover:ring-2">
			<Search size={32} />
			<input
				type="search"
				class="pointer-events-none grow cursor-pointer"
				placeholder={m.ask_ai()}
			/>
			<kbd class="kbd kbd-sm">⌘</kbd>
			<kbd class="kbd kbd-sm">K</kbd>
		</label>
	</div>
</nav>
