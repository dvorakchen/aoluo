<!-- 
Admin layout component that wraps all admin pages. It can be used to add common UI elements like navigation bars, sidebars, etc.
The `children` prop contains the content of the specific admin page being rendered.
	  
-->

<script lang="ts">
	import Sidebar from './sidebar.svelte';
	import Header from './header.svelte';
	import { layoutStore } from '$lib/client/store/layout.svelte';

	const { children } = $props();

	const sidebarCollapsed = $derived(layoutStore.sidebarWidth === 0);
</script>

<div
	class="grid h-screen w-screen grid-cols-[300px_1fr] grid-rows-[auto_1fr] transition-all duration-300"
	style:grid-template-columns={sidebarCollapsed ? '0px 1fr' : ''}
>
	<!-- Sidebar: 左侧固定宽度，高度占满 -->
	<aside
		class="relative row-span-2 h-full overflow-hidden overflow-y-auto border-r border-base-300"
	>
		<Sidebar />
	</aside>

	<!-- Header: 顶部固定 -->
	<header class="col-start-2">
		<Header />
	</header>

	<!-- Main Content: 独立滚动区域 -->
	<main class="col-start-2 overflow-y-auto bg-base-100">
		<div class="p-4">
			{@render children()}
		</div>
	</main>
</div>
