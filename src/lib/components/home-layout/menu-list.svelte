<!-- 
导航栏的菜单，这个设计中多个菜单组合成一个分组，分组内的菜单可以展开显示子菜单项。每个菜单项包含一个图标和一个标题，点击后会显示对应的子菜单链接。 
-->

<script lang="ts">
	import Menu, { type MenuListProps } from './menu.svelte';

	const {
		topTitle,
		list
	}: {
		topTitle: string;
		list: MenuListProps;
	} = $props();
</script>

<ul class="menu mt-4 w-full">
	<li class="pointer-events-none">
		<span class="ml-4 px-0 pb-0 text-base-content">{topTitle}</span>
	</li>

	<li>
		<Menu Icon={list.Icon} title={list.title} links={list.links}></Menu>
	</li>
</ul>
