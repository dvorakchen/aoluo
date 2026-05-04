<script lang="ts">
	import { layoutStore } from '$lib/client/store/layout.svelte';
	import { ListIndentDecrease } from '@lucide/svelte';
	import ThemeController from '$lib/components/theme-controller.svelte';
	import ChangeLang from '$lib/components/change-lang.svelte';
	import BellMessage from './bell-message.svelte';
	import AiSearch from '$lib/components/ai-window/ai-search.svelte';

	function handleCollapsed() {
		layoutStore.sidebarWidth = layoutStore.sidebarWidth === 0 ? 300 : 0;
	}
</script>

<nav class="navbar w-full border-b border-b-base-300 bg-base-100 pt-4 pr-0 pb-0 shadow-sm">
	<button aria-label="open sidebar" class="btn mb-2 btn-square btn-ghost" onclick={handleCollapsed}>
		<!-- Sidebar toggle icon -->
		<ListIndentDecrease />
	</button>
	<div class="mr-4 mb-3 flex grow flex-row-reverse items-center gap-2">
		<BellMessage />
		<ThemeController />
		<ChangeLang />
		<AiSearch />
	</div>
</nav>
