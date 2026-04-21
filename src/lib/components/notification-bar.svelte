<!-- 
通知组件，固定在页面最顶部显示。
通知不会自动关闭，需要用户点击关闭按钮来移除。
多个通知会叠加在一起，但视觉上限制最多显示 3 层叠加感。
	  
-->

<script lang="ts">
	import { notificationStore, type Notification } from '$lib/client/store/notification.svelte';
	import { m } from '$lib/paraglide/messages';
	import { X } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';

	const take3 = $derived(notificationStore.list.slice(0, 3));

	function handleClose(notification: string) {
		notificationStore.remove(notification);
	}
</script>

{#if notificationStore.list.length > 0}
	<div class="pointer-events-none fixed top-0 right-0 left-0 z-100 flex h-32 justify-center p-4">
		{#each take3 as notification, i (notification.text)}
			<div
				class="pointer-events-auto absolute w-full max-w-2xl"
				in:fade
				out:fly={{ y: -100, duration: 500 }}
				style:transform="translateY({i * 8}px) scale({1 - i * 0.05})"
				style:z-index={100 - i}
			>
				{#if notification.type === 'warning'}
					{@render warning(notification)}
				{:else}
					{@render info(notification)}
				{/if}
			</div>
		{/each}
	</div>
{/if}

{#snippet info(notification: Notification)}
	<div role="alert" class="alert alert-vertical alert-soft alert-info shadow sm:alert-horizontal">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="h-6 w-6 shrink-0 stroke-info"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
		<span>{notification.text}</span>
		<div
			class="tooltip tooltip-bottom"
			data-tip={`${m.rest_notifications({ count: notificationStore.list.length })}`}
		>
			<button class="btn btn-dash btn-sm btn-info" onclick={() => handleClose(notification.text)}>
				<X />
			</button>
		</div>
	</div>
{/snippet}

{#snippet warning(notification: Notification)}
	<div
		role="alert"
		class="alert alert-vertical alert-soft alert-warning shadow sm:alert-horizontal"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="h-6 w-6 shrink-0 stroke-warning"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
		<span>{notification.text}</span>
		<div
			class="tooltip tooltip-bottom"
			data-tip={`${m.rest_notifications({ count: notificationStore.list.length })}`}
		>
			<button
				class="btn btn-dash btn-sm btn-warning"
				onclick={() => handleClose(notification.text)}
			>
				<X />
			</button>
		</div>
	</div>
{/snippet}
