<script lang="ts" module>
	import { type Component } from 'svelte';

	export type MenuLink = {
		Icon?: Component;
		label: string;
		href: string;
	};

	export type MenuType = {
		open?: boolean;
		Icon: Component;
		label: string;
		links: MenuLink[];
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

	const { menu }: MenuProps = $props();

	function isActive(href: string) {
		if (href === '/' && page.url.pathname !== href) {
			return false;
		}
		return page.url.pathname.startsWith(href);
	}

	function isMenuOpen(menuItem: MenuLink | MenuType) {
		if (isMenuType(menuItem)) {
			const linkActive = menuItem.links.some((link) => isActive(link.href));
			return menuItem.open || linkActive;
		}
		return false;
	}
</script>

{#each menu as menuItem (menuItem.label)}
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
				{#each menuItem.links as link (link.label + link.href)}
					<li>
						<a href={link.href} class:menu-link-active={isActive(link.href)}>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</details>
	{:else}
		<!-- 这里使用的是 DaisyUI 的 Menu - 直接链接 -->
		<a
			href={menuItem.href}
			class="min-w-48 transition-[margin] {isActive(menuItem.href) ? 'ml-2 menu-link-active' : ''}"
		>
			<menuItem.Icon size={16} />
			{menuItem.label}
		</a>
	{/if}
{/each}
