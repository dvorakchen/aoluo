<!-- 用户挑选用户 -->
<script lang="ts">
	import { http } from '$lib/client/http';
	import type { PaginationResult, User } from '$lib/shared';
	import { X, Check } from '@lucide/svelte';
	import Pagination from './pagination.svelte';
	import UserAvatar from './user-avatar.svelte';
	import { m } from '$lib/paraglide/messages';

	let {
		excludes = [],
		onPick
	}: {
		excludes?: User[];
		onPick?: (users: User[]) => void;
	} = $props();

	let page = $state(1);
	let totalPages = $state(0);

	let pickedList: User[] = $state([]);

	// 使用 Set 进行 O(1) 查找，优化渲染性能
	let pickedIds = $derived(new Set(pickedList.map((u) => u.id)));
	let excludedIds = $derived(new Set(excludes.map((u) => u.id)));

	let getList: Promise<User[]> = $derived.by(async () => {
		const users: PaginationResult<User> = await http(`users?page=${page}`);
		totalPages = users.pagination.totalPages;
		return users.list;
	});

	function togglePick(user: User) {
		if (excludedIds.has(user.id)) return;

		if (pickedIds.has(user.id)) {
			pickedList = pickedList.filter((t) => t.id !== user.id);
		} else {
			pickedList.push(user);
		}
	}

	function clearPicked() {
		pickedList = [];
	}
</script>

<div class="flex w-full flex-col gap-4">
	<!-- 已选用户区域：增加背景色和边框，使其更像一个表单区域 -->
	<div class="rounded-box border border-base-content/10 bg-base-200/50 p-4">
		<div class="mb-2 flex items-center justify-between">
			<span class="text-xs font-bold tracking-wider uppercase opacity-60">
				{pickedList.length > 0
					? m.user_picker_selected_count({ count: pickedList.length })
					: m.user_picker_no_selected()}
			</span>
			{#if pickedList.length > 0}
				<button class="btn text-error btn-ghost btn-xs" onclick={clearPicked}
					>{m.user_picker_clear_all()}</button
				>
			{/if}
		</div>

		<div class="flex w-full flex-wrap gap-2">
			{#each pickedList as pickedUser (pickedUser.id)}
				<button
					class="badge gap-1 py-3 transition-all badge-primary hover:scale-105 active:scale-95"
					onclick={() => togglePick(pickedUser)}
					title={m.user_picker_unpick_title()}
				>
					{pickedUser.displayUsername}
					<X size={14} />
				</button>
			{/each}
			{#if pickedList.length === 0}
				<div class="py-1 text-sm italic opacity-40">{m.user_picker_select_hint()}</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-col gap-4">
		<div class="min-h-75 grow">
			<!-- 用户列表：增加骨架屏加载状态 -->
			{#await getList}
				<div class="flex flex-col gap-3 py-4">
					{#each [1, 2, 3, 4, 5] as i (i)}
						<div class="flex items-center gap-4 px-4 py-2 opacity-50">
							<div class="h-10 w-10 shrink-0 rounded-full bg-base-300"></div>
							<div class="flex grow flex-col gap-2">
								<div class="h-4 w-24 rounded bg-base-300"></div>
								<div class="h-3 w-16 rounded bg-base-300"></div>
							</div>
							<div class="h-8 w-16 rounded bg-base-300"></div>
						</div>
					{/each}
				</div>
			{:then list}
				{@render userList(list)}
			{/await}
		</div>

		<div class="flex items-center justify-between border-t border-base-content/5 pt-4">
			<Pagination
				{page}
				{totalPages}
				onPageChange={(v) => {
					page = v;
				}}
			/>
			<button
				class="btn px-8 shadow-md btn-primary"
				disabled={pickedList.length === 0}
				onclick={() => {
					onPick?.(pickedList);
				}}
			>
				{m.user_picker_confirm()}
			</button>
		</div>
	</div>
</div>

{#snippet userList(list: User[])}
	<ul
		class="list w-full overflow-hidden rounded-xl border border-base-content/10 bg-base-100 shadow-sm"
	>
		{#each list as user (user.id)}
			{@const isExcluded = excludedIds.has(user.id)}
			{@const isPicked = pickedIds.has(user.id)}
			<button
				class="list-row group flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-base-200/60"
				class:opacity-60={isExcluded}
				onclick={() => !isExcluded && togglePick(user)}
				aria-label="pick"
			>
				<div class="shrink-0">
					<UserAvatar displayUsername={user.displayUsername ?? ''} image={user.image} size="40px" />
				</div>
				<div class="flex grow flex-col">
					<div class="font-bold">{user.displayUsername}</div>
					<div class="text-xs opacity-50">@{user.username}</div>
				</div>

				<div class="shrink-0">
					{#if isExcluded}
						<div class="badge badge-ghost badge-sm italic">{m.user_picker_excluded()}</div>
					{:else if isPicked}
						<div class="flex items-center gap-2">
							<span class="text-xs font-bold text-primary">{m.user_picker_selected()}</span>
							<div class="rounded-full bg-primary p-1 text-primary-content">
								<Check size={14} strokeWidth={3} />
							</div>
						</div>
					{:else}
						<span class="btn px-4 btn-outline btn-sm btn-primary group-hover:opacity-100">
							{m.user_picker_select()}
						</span>
					{/if}
				</div>
			</button>
		{/each}
		{#if list.length === 0}
			<li class="p-10 text-center text-sm opacity-50">{m.user_picker_empty()}</li>
		{/if}
	</ul>
{/snippet}
