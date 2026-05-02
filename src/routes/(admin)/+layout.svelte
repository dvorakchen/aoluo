<!-- 
Admin layout component that wraps all admin pages. It can be used to add common UI elements like navigation bars, sidebars, etc.
The `children` prop contains the content of the specific admin page being rendered.
	  
-->

<script lang="ts">
	import Layout from '$lib/components/home-layout/layout.svelte';
	import { onMount } from 'svelte';

	import type { LayoutProps } from './$types';
	import { userStore } from '$lib/client/store/user.svelte';

	const { children, data }: LayoutProps = $props();

	onMount(async () => {
		userStore.setUser(data.user, data.teams);
	});
</script>

<Layout>
	{@render children()}
</Layout>
