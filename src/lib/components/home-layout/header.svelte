<script lang="ts">
	import { layoutStore } from '$lib/client/store/layout.svelte';
	import { m } from '$lib/paraglide/messages';
	import { ListIndentDecrease } from '@lucide/svelte';

	const menuI18n = $derived(
		`menu_${layoutStore.activeMenu.toLowerCase()}`
	) as unknown as 'menu_dashboard';

	function handleCollapsed() {
		layoutStore.sidebarWidth = layoutStore.sidebarWidth === 0 ? 300 : 0;
	}
</script>

<nav class="navbar w-full border-b border-b-base-300 bg-base-100 shadow-sm">
	<button aria-label="open sidebar" class="btn btn-square btn-ghost" onclick={handleCollapsed}>
		<!-- Sidebar toggle icon -->
		<ListIndentDecrease />
	</button>
	<div class="px-4">
		<h1 class="text-2xl font-bold">
			{m[menuI18n]() || layoutStore.activeMenu}
		</h1>
		<h3>
			<div class="breadcrumbs text-sm">
				<ul>
					{#each layoutStore.breadcrumbs.list as crumb (crumb)}
						<li>{crumb}</li>
					{/each}
				</ul>
			</div>
		</h3>
	</div>
</nav>
