<script module>
	import type { User } from '$lib/shared';

	export type Props = { user: User };
</script>

<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	let { user }: Props = $props();
</script>

{#if !user.removed && !user.banned}
	<div class="badge badge-success">{m.active()}</div>
{/if}
{#if user.banned}
	<div class="badge badge-error">{m.banned()}</div>
{/if}
{#if user.removed}
	<div class="badge badge-warning">{m.resigned()}</div>
{/if}
