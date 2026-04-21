<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import { type Snippet } from 'svelte';

	type MenuListProps = {
		icon: Snippet;
		title: string;
		links: { label: string; href: ResolvedPathname }[];
	};

	const { icon, title, links }: MenuListProps = $props();
</script>

<details class="mt-1 rounded p-1 pr-2 hover:bg-base-200">
	<summary class="bg-transparent">
		{@render icon()}
		<span class="text-lg font-semibold">{title}</span>
	</summary>
	<ul class="pb-4">
		{#each links as link (link.label + link.href)}
			<li>
				<a href={link.href} rel="external">
					{link.label}
				</a>
			</li>
		{/each}
	</ul>
</details>
