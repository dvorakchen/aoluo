<!-- 
导航栏的菜单，这个设计中多个菜单组合成一个分组，分组内的菜单可以展开显示子菜单项。每个菜单项包含一个图标和一个标题，点击后会显示对应的子菜单链接。 
-->

<script lang="ts">
	import { LayoutDashboard } from '@lucide/svelte';
	import Menu from './menu.svelte';
	import { resolve } from '$app/paths';

	const { topTitle } = $props();
</script>

<ul class="menu mt-4 w-full">
	<li class="pointer-events-none">
		<span class="px-0 text-base-content">{@render topTitle()}</span>
	</li>
	<li>
		<Menu
			title="Dashboard"
			links={[
				{ label: 'Submenu 1', href: resolve('/#') },
				{ label: 'Submenu 2', href: resolve('/#') }
			]}
		>
			{#snippet icon()}
				<LayoutDashboard />
			{/snippet}
		</Menu>
	</li>
	<li>
		<Menu
			title="Dashboard"
			links={[
				{ label: 'Submenu 1', href: resolve('/#') },
				{ label: 'Submenu 2', href: resolve('/#') }
			]}
		>
			{#snippet icon()}
				<LayoutDashboard />
			{/snippet}
		</Menu>
	</li>
	<li>
		<Menu
			title="Dashboard"
			links={[
				{ label: 'Submenu 1', href: resolve('/#') },
				{ label: 'Submenu 2', href: resolve('/#') }
			]}
		>
			{#snippet icon()}
				<LayoutDashboard />
			{/snippet}
		</Menu>
	</li>
</ul>
