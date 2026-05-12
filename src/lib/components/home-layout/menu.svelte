<script lang="ts" module>
	import { type Component } from 'svelte';

	/**
	 * 菜单链接，作为一个独立的菜单，点击后会立即跳转
	 */
	export type MenuLink = {
		Icon?: Component;
		label: string;
		link: string;
		/**
		 * 权限，满足权限的当前用户才会显示菜单
		 */
		permissions?: PermissionSchema | PermissionValue | null;
	};

	/**
	 * 菜单类别，作为一个折叠的菜单，点击后会展开关闭菜单，
	 * 实际的菜单在 links 里
	 */
	export type MenuType = {
		open?: boolean;
		Icon: Component;
		label: string;
		links: MenuLink[];
		/**
		 * 权限，满足权限的当前用户才会显示菜单
		 */
		permissions?: PermissionSchema | PermissionValue | null;
	};

	/**
	 * list 里的 label 不可以重复
	 */
	export type MenuProps = {
		menu: (MenuLink | MenuType)[];
	};

	export function isMenuType(item: MenuLink | MenuType): item is MenuType {
		return 'links' in item;
	}
</script>

<script lang="ts">
	import { page } from '$app/state';
	import { PermissionSchema, type PermissionValue } from '$lib/shared';
	import { hasPermissions } from '$lib/client/permission/attachments/permission-guard';

	const { menu }: MenuProps = $props();

	function isActive(href: string) {
		if (href === '/' && page.url.pathname !== href) {
			return false;
		}
		return page.url.pathname.startsWith(href);
	}

	function isMenuOpen(menuItem: MenuLink | MenuType) {
		if (isMenuType(menuItem)) {
			const linkActive = menuItem.links.some((link) => isActive(link.link));
			return menuItem.open || linkActive;
		}
		return false;
	}
</script>

{#each menu as menuItem (menuItem.label)}
	{#if menuItem.permissions}
		{#await hasPermissions(menuItem.permissions) then value}
			{#if value}
				{@render renderMenu(menuItem)}
			{/if}
		{/await}
	{:else}
		{@render renderMenu(menuItem)}
	{/if}
{/each}

{#snippet renderMenu(menuItem: MenuLink | MenuType)}
	{#if isMenuType(menuItem)}
		<!-- 这里使用的是 DaisyUI 的 Menu - 带有子菜单 -->
		<details
			class="min-w-48 rounded-xl pr-2 hover:bg-base-200"
			open={isMenuOpen(menuItem)}
			ontoggle={(e) => {
				const isOpen = e.currentTarget.open;
				menuItem.open = isOpen;
			}}
		>
			<summary class="bg-transparent">
				<menuItem.Icon size={18} />
				<span class="text font-medium">{menuItem.label}</span>
			</summary>
			<ul class="pb-4">
				{#each menuItem.links as link (link.label + link.link)}
					<li>
						<a href={link.link} class:menu-link-active={isActive(link.link)}>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</details>
	{:else}
		<!-- 这里使用的是 DaisyUI 的 Menu - 直接链接 -->
		<a
			href={menuItem.link}
			class="min-w-48 transition-[margin] {isActive(menuItem.link) ? 'ml-2 menu-link-active' : ''}"
		>
			<menuItem.Icon size={16} />
			{menuItem.label}
		</a>
	{/if}
{/snippet}
