<script lang="ts">
	import { X } from '@lucide/svelte';

	let { label = '', clearable = false, value = $bindable('' as string | null), ...attr } = $props();
</script>

<label class="input">
	{#if label}
		<span class="label">{label}</span>
	{/if}
	<input {...attr} bind:value />
	{#if clearable}
		<button class="label cursor-pointer" onclick={() => (value = '')}>
			<X />
		</button>
	{/if}
</label>
