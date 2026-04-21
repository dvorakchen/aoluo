<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import NotificationBar from '$lib/components/notification-bar.svelte';
	import Toast from '$lib/components/toast.svelte';
	import './app.css';

	let { children } = $props();
</script>

<NotificationBar />
<Toast />

{@render children()}

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
