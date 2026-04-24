<script lang="ts" module>
	export type MenuListProps = {
		Icon: Component;
		title: string;
		links: { label: string; href: string }[];
	};
</script>

<script lang="ts">
	import { type Component } from 'svelte';
	import { page } from '$app/state';

	const { Icon, title, links }: MenuListProps = $props();

	let open = $state(false);
	$effect(() => {
		open = links.some((link) => isActive(link.href));
	});

	function isActive(href: string) {
		if (href === '/' && page.url.pathname !== href) {
			return false;
		}
		return page.url.pathname.startsWith(href);
	}
</script>

<details class="rounded p-1 pr-2 hover:bg-base-200" {open}>
	<summary class="bg-transparent">
		<Icon size={20} />
		<span class="text-lg font-medium">{title}</span>
	</summary>
	<ul class="pb-4">
		{#each links as link (link.label + link.href)}
			<li>
				<a href={link.href} class:link-active={isActive(link.href)}>
					{link.label}
				</a>
			</li>
		{/each}
	</ul>
</details>
