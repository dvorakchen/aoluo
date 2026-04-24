<!-- 通知，信息什么的 -->
<script lang="ts">
	import {
		bellMessageStore,
		BellMessageType,
		type BellMessage,
		type BellMessageTypeValue,
		type ChatMessage,
		type TodoMessage
	} from '$lib/client/store/bell-message.svelte';
	import { m } from '$lib/paraglide/messages';
	import { Bell, BookCheck, ListCheck, ListTodo, X } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let isOpen = $state(false);

	onMount(() => {
		bellMessageStore.refresh();
	});

	function close() {
		isOpen = false;
	}

	function read(id: string) {
		bellMessageStore.read(id);
	}

	function readAll() {
		bellMessageStore.readAll();
	}
</script>

<div class="drawer drawer-end btn-square">
	<input id="drawer-side-right" type="checkbox" class="drawer-toggle" bind:checked={isOpen} />
	<div class="drawer-content">
		<!-- Page content here -->
		<div class="indicator">
			{#if bellMessageStore.hasMessage}
				<span class="indicator-item badge indicator-center badge-primary"
					>{bellMessageStore.list.length}</span
				>
			{/if}
			<label for="drawer-side-right" class="drawer-button btn btn-square btn-ghost"
				><Bell size={26} /></label
			>
		</div>
	</div>
	<div class="drawer-side">
		<label for="drawer-side-right" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="min-h-full w-1/4 min-w-96 space-y-8 bg-base-100 pt-0 pb-8">
			<!-- Sidebar content here -->
			<div class="sticky top-0 z-10 flex gap-2 bg-base-100 p-4 shadow">
				<div class="grow">
					<button
						class="tooltip btn tooltip-bottom btn-square btn-ghost"
						data-tip={m.all_read()}
						onclick={readAll}
					>
						<ListCheck />
					</button>
				</div>
				<button class="btn btn-square btn-soft btn-error" onclick={close}>
					<X />
				</button>
			</div>

			<div class="space-y-8 px-4">
				{#if bellMessageStore.groups}
					{#each Object.entries(bellMessageStore.groups) as [type, group] (type)}
						{@render messageGroup(type as BellMessageTypeValue, group)}
					{/each}
				{/if}
			</div>
		</ul>
	</div>
</div>

{#snippet messageGroup(type: BellMessageTypeValue, group: BellMessage[])}
	<ul class="list rounded-box bg-base-100 shadow-all">
		{#if type === BellMessageType.chat}
			{@render chatMessage(group as BellMessage<ChatMessage>[])}
		{:else if type === BellMessageType.todo}
			{@render todoMessage(group as BellMessage<TodoMessage>[])}
		{/if}
	</ul>
{/snippet}

{#snippet chatMessage(list: BellMessage<ChatMessage>[])}
	<li class="flex items-center gap-2 p-4 pb-2 text-xs tracking-wide opacity-60">
		{m.unread_chat_message()}
		<div class="badge badge-sm badge-info">+99</div>
	</li>

	{#each list as msg (msg.id)}
		<li class="list-row">
			<div>
				<img
					class="size-10 rounded-box"
					src={msg.data!.sender.avatar}
					alt={msg.data!.sender.username}
				/>
			</div>
			<div>
				<div class="font-medium">{msg.data!.sender.username}</div>
				<div class="text-xs font-semibold">{msg.text}</div>
			</div>

			<button
				class="tooltip btn tooltip-top btn-square"
				class:btn-success={msg.isRead}
				class:btn-ghost={!msg.isRead}
				data-tip={m.read()}
				onclick={() => read(msg.id)}
			>
				<BookCheck />
			</button>
		</li>
	{/each}
{/snippet}

{#snippet todoMessage(list: BellMessage<TodoMessage>[])}
	<li class="flex items-center gap-2 p-4 pb-2 text-xs tracking-wide opacity-60">
		{m.todo_message()}
		<div class="badge badge-sm badge-info">+99</div>
	</li>

	{#each list as msg (msg.id)}
		<li class="list-row">
			<div class="flex items-center">
				<ListTodo />
			</div>
			<a class="tooltip btn tooltip-top btn-ghost" href={msg.data?.link} data-tip={m.click_goto()}>
				<div class="text-xs font-semibold">{msg.text}</div>
			</a>

			<button
				class="tooltip btn tooltip-top btn-square"
				class:btn-success={msg.isRead}
				class:btn-ghost={!msg.isRead}
				data-tip={m.read()}
				onclick={() => read(msg.id)}
			>
				<BookCheck />
			</button>
		</li>
	{/each}
{/snippet}
