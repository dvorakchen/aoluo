<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { MoveLeft, CircleAlert } from '@lucide/svelte';
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
	<div class="mb-6 text-error">
		<CircleAlert size={64} strokeWidth={1.5} />
	</div>

	<h1 class="mb-2 text-5xl font-extrabold tracking-tight">
		{page.status}
	</h1>

	<h2 class="mb-6 text-2xl font-semibold text-base-content/70">
		{page.error?.message || m.unexpected_error()}
	</h2>

	{#if page.error?.hint}
		<span class="mb-8 text-sm">{page.error.hint}</span>
	{/if}

	<div class="flex gap-4">
		<a href="/teams" class="btn gap-2 btn-primary">
			<MoveLeft size={18} />
			{m.back_to_list({ name: m.team() })}
		</a>
		<button class="btn btn-outline btn-secondary" onclick={() => window.location.reload()}>
			{m.refresh()}
		</button>
	</div>
</div>
