<!-- 
Admin layout component that wraps all admin pages. It can be used to add common UI elements like navigation bars, sidebars, etc.
The `children` prop contains the content of the specific admin page being rendered.
	  
-->

<script lang="ts">
	import Sidebar from './sidebar.svelte';
	import Header from './header.svelte';

	const { children } = $props();
</script>

<div
	class="grid h-screen w-screen overflow-hidden"
	style="grid-template-columns: 300px 1fr; grid-template-rows: auto 1fr;"
>
	<!-- Sidebar: 左侧固定宽度，高度占满 -->
	<aside class="row-span-2 h-full overflow-y-auto border-r border-base-300">
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
