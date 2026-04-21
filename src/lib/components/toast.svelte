<script lang="ts">
	import { toastStore } from '$lib/client/store/toast.svelte';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
</script>

<div class="toast toast-end toast-top z-200 flex-col-reverse">
	{#each toastStore.list as toast (toast.id)}
		<div
			animate:flip={{ duration: 300 }}
			in:fly={{ x: 100, duration: 300 }}
			out:fade={{ duration: 200 }}
			class="alert shadow-lg"
			class:alert-info={toast.type === 'info'}
			class:alert-warning={toast.type === 'warning'}
			class:alert-error={toast.type === 'error'}
		>
			<span>{toast.message}</span>
		</div>
	{/each}
</div>
