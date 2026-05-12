<!-- 
导航栏的菜单，这个设计中多个菜单组合成一个分组，分组内的菜单可以展开显示子菜单项。每个菜单项包含一个图标和一个标题，点击后会显示对应的子菜单链接。 
-->

<script module>
	import type { PermissionSchema, PermissionValue } from '$lib/shared';

	/**
	 * MenuListDateType 是一个菜单组，归纳多个菜单，以在视觉上有分类效果，
	 * 如菜单：员工管理、请假管理。会被归到 '人事管理'
	 * topTitle 不可以重复
	 * list 里的 title 不可以重复
	 */
	export type MenuListDateType = {
		/**
		 * 菜单组的标题
		 */
		topTitle: string;
		/**
		 * 菜单
		 */
		menu: (MenuLink | MenuType)[];
		/**
		 * 权限，满足权限的当前用户才会显示菜单
		 */
		permissions?: PermissionSchema | PermissionValue | null;
	};
</script>

<script lang="ts">
	import Menu, { type MenuLink, type MenuType } from './menu.svelte';

	const { topTitle, menu }: MenuListDateType = $props();
</script>

<ul class="menu mt-4 w-full">
	<li class="pointer-events-none mb-2">
		<span class="ml-3 px-0 pb-0 text-xs text-base-content/80">{topTitle}</span>
	</li>

	<li>
		<Menu {menu}></Menu>
	</li>
</ul>
