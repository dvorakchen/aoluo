<!-- 带有确认的删除按钮 -->
<!-- 正常下是一个删除按钮，点击删除后，按钮平移切换为一个'确认删除？'的按钮，再次点击后触发 onDelete 方法 -->
<script lang="ts">
	import { Trash2, X } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages';

	let {
		onDelete,
		label = m.delete(),
		confirmLabel = m.confirm_delete()
	}: {
		onDelete: () => void | Promise<void>;
		label?: string;
		confirmLabel?: string;
	} = $props();

	let confirmed = $state(false);
	let pending = $state(false);

	async function handleConfirm() {
		if (pending || !confirmed) return;
		pending = true;
		try {
			await onDelete();
		} finally {
			pending = false;
			confirmed = false;
		}
	}

	function handleFirstClick() {
		confirmed = true;
	}

	function handleCancel() {
		confirmed = false;
	}
</script>

<div class="inline-grid items-center">
	<!-- 初始状态 -->
	<div
		class="col-start-1 row-start-1 flex items-center transition-all duration-200"
		class:opacity-0={confirmed}
		class:pointer-events-none={confirmed}
		class:translate-x-[-10px]={confirmed}
	>
		<button class="btn whitespace-nowrap btn-outline btn-sm btn-error" onclick={handleFirstClick}>
			<Trash2 size={14} />
			{label}
		</button>
	</div>

	<!-- 确认状态 -->
	<div
		class="col-start-1 row-start-1 flex items-center gap-1 transition-all duration-200"
		class:opacity-0={!confirmed}
		class:pointer-events-none={!confirmed}
		class:translate-x-[10px]={!confirmed}
	>
		<button
			class="btn whitespace-nowrap btn-sm btn-error"
			onclick={handleConfirm}
			disabled={pending}
		>
			{#if pending}
				<span class="loading loading-sm loading-spinner"></span>
			{:else}
				<Trash2 size={14} />
			{/if}
			{confirmLabel}
		</button>
		<button class="btn btn-square btn-soft btn-sm" onclick={handleCancel} disabled={pending}>
			<X size={14} />
		</button>
	</div>
</div>
