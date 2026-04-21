<!-- 
Admin layout component that wraps all admin pages. It can be used to add common UI elements like navigation bars, sidebars, etc.
The `children` prop contains the content of the specific admin page being rendered.
	  
-->

<script lang="ts">
	import Layout from '$lib/components/home-layout/layout.svelte';

	import type { LayoutProps } from './$types';

	const { children }: LayoutProps = $props();
</script>

<Layout>
	{@render children()}
</Layout>
