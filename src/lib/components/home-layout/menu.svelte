<script lang="ts" module>
	export type MenuLink = {
		Icon?: Component;
		label: string;
		href: string;
	};

	export type MenuType = {
		open?: boolean;
		Icon: Component<{ size: number }>;
		title: string;
		links: MenuLink[];
	};

	/**
	 * list 里的 title 不可以重复
	 */
	export type MenuProps = {
		menu: MenuLink | MenuType[];
	};
</script>

<script lang="ts">
	import { type Component } from 'svelte';
	import { page } from '$app/state';

	const { menu }: MenuProps = $props();

	function isActive(href: string) {
		if (href === '/' && page.url.pathname !== href) {
			return false;
		}
		return page.url.pathname.startsWith(href);
	}

	function isMenuOpen(menu: MenuType) {
		const linkActive = menu.links.some((link) => isActive(link.href));
		return menu.open || linkActive;
	}
</script>

{#if Array.isArray(menu)}
	{#each menu as menuItem (menuItem.title)}
		<!-- 这里使用的是 DaisyUI 的 Menu -->
		<details
			class="rounded-xl pr-2 hover:bg-base-200"
			open={isMenuOpen(menuItem)}
			ontoggle={(e) => {
				const isOpen = e.currentTarget.open;
				menuItem.open = isOpen;
			}}
		>
			<summary class="bg-transparent">
				<menuItem.Icon size={18} />
				<span class="text font-medium">{menuItem.title}</span>
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
	{/each}
{:else}
	<a
		href={menu.href}
		class="transition-[margin] {isActive(menu.href) ? 'ml-2 menu-link-active' : ''}"
	>
		<menu.Icon size={16} />
		{menu.label}
	</a>
{/if}
