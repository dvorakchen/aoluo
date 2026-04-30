<script lang="ts">
	let {
		image,
		displayUsername,
		size = '32px'
	}: { image?: string | null; displayUsername: string; size?: string } = $props();
</script>

<div class="">
	{#if image}
		<div class="avatar">
			<div class="rounded-xl" style:width={size} style:height={size}>
				<img class="h-full w-full object-cover" src={image} alt="avatar" />
			</div>
		</div>
	{:else}
		<div class="avatar avatar-placeholder">
			<div
				class="rounded-full bg-neutral text-lg text-neutral-content uppercase"
				style:width={size}
				style:height={size}
			>
				<span>{displayUsername?.substring(0, 1)}</span>
			</div>
		</div>
	{/if}
</div>
