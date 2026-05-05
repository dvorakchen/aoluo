<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Check, Copy } from '@lucide/svelte';

	/**
	 * 一个简单的复制按钮组件，点击后会将指定文本复制到剪贴板。
	 */
	let { text, label = m.copy() } = $props();

	let copied = $state(false);

	async function onclick() {
		await navigator.clipboard.writeText(text);
		copied = true;
	}
</script>

<button class="btn btn-xs btn-secondary" {onclick}
	>{label}
	{#if copied}
		<Check size={12} stroke="3px" />
	{:else}
		<Copy size={12} />
	{/if}
</button>
