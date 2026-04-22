<script lang="ts">
	import { ChevronUp } from '@lucide/svelte';
	import { userStore } from '$lib/client/store/user.svelte';
	import { authClient } from '$lib/client/auth';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	async function handleLogout() {
		await authClient.signOut();
		userStore.clear();
		goto(resolve('/login'));
	}
</script>

<div class="bg-base-100 px-1 pb-2">
	<div class="dropdown dropdown-end dropdown-top w-full">
		<div
			tabindex="0"
			role="button"
			class="btn h-full w-full px-3 py-1 shadow-2xl shadow-top btn-ghost"
		>
			<div class="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 gap-x-4 gap-y-1">
				<!-- 头像 -->
				<div class="col-start-1 row-span-2 items-center justify-center">
					{#if userStore.user?.image}
						<div class="avatar">
							<div class="w-12 rounded-xl">
								<img class="h-full w-full object-cover" src={userStore.user.image} alt="avatar" />
							</div>
						</div>
					{:else}
						<div class="avatar avatar-placeholder">
							<div class="w-12 rounded-full bg-neutral text-lg text-neutral-content uppercase">
								<span>{userStore.user?.displayUsername?.substring(0, 1)}</span>
							</div>
						</div>
					{/if}
				</div>
				<!-- 用户名 -->
				<div class="col-start-2 row-start-1 min-w-0 self-end text-start text-lg font-bold">
					<h3 class="truncate">{userStore.user?.displayUsername ?? ''}</h3>
				</div>
				<!-- 用户邮箱 -->
				<div class="col-start-2 row-start-2 min-w-0 self-start text-start text-sm font-light">
					<address class="truncate">{userStore.user?.email ?? ''}</address>
				</div>
				<!-- 箭头 -->
				<div class="col-start-3 row-span-2 row-start-1">
					<ChevronUp size={32} stroke="3px" />
				</div>
			</div>
		</div>
		<ul
			tabindex="-1"
			class="dropdown-content menu z-1 mb-2 w-full rounded-box border border-base-200 bg-base-100 shadow-2xl shadow-top"
		>
			<li class="pointer-events-none divider h-px"></li>
			<li>
				<button class="btn btn-wide btn-soft btn-sm btn-error" onclick={handleLogout}>Logout</button
				>
			</li>
		</ul>
	</div>
</div>
