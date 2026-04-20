<script lang="ts">
	import ChangeLang from '$lib/components/change-lang.svelte';
	import ThemeController from '$lib/components/theme-controller.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	$inspect(data);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<ThemeController />
<ChangeLang />
