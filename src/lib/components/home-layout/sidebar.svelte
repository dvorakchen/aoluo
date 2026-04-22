<!-- 
Sidebar component for the admin dashboard.
	 
侧边栏组件，用于显示 Logo、导航菜单和当前登录的用户
三类信息上下排列	  
-->

<script lang="ts">
	import logo from '$lib/assets/logo/logo-64x64.webp';
	import { m } from '$lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import MenuList from './menu-list.svelte';
	import UserCard from './user-card.svelte';
</script>

<aside class="flex h-full flex-col pb-4">
	<header class="sticky top-0 z-10 bg-base-100 p-2 shadow">
		<a class="mx-2 flex gap-4 rounded p-2 hover:bg-base-200" href={resolve('/')}>
			<!-- Home icon -->
			<img src={logo} alt="Logo" class="max-h-12 max-w-12" />
			<div>
				<h1 class="text-lg font-bold">{m.title()}</h1>
				<span class="text-sm text-nowrap">{m.admin_dashboard()}</span>
			</div>
		</a>
	</header>

	<div class="mb-8 grow">
		<MenuList>
			{#snippet topTitle()}
				Overview
			{/snippet}
		</MenuList>
		<MenuList>
			{#snippet topTitle()}
				Overview
			{/snippet}
		</MenuList>
		<MenuList>
			{#snippet topTitle()}
				Overview
			{/snippet}
		</MenuList>
		<MenuList>
			{#snippet topTitle()}
				Overview
			{/snippet}
		</MenuList>
		<MenuList>
			{#snippet topTitle()}
				Overview
			{/snippet}
		</MenuList>
		<MenuList>
			{#snippet topTitle()}
				Overview
			{/snippet}
		</MenuList>
		<MenuList>
			{#snippet topTitle()}
				Overview
			{/snippet}
		</MenuList>
	</div>

	<div class="sticky bottom-0">
		<UserCard />
	</div>
</aside>
