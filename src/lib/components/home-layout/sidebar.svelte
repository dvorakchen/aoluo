<!-- 
Sidebar component for the admin dashboard.
	 
侧边栏组件，用于显示 Logo、导航菜单和当前登录的用户
三类信息上下排列	  
-->

<script lang="ts">
	import logo from '$lib/assets/logo/logo-64x64.webp';
	import { m } from '$lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import MenuList, { type MenuListDateType } from './menu-list.svelte';
	import UserCard from './user-card.svelte';
	import { GitFork, LayoutDashboard } from '@lucide/svelte';

	const menuList: MenuListDateType[] = [
		{
			topTitle: m.menu_overview(),
			menu: {
				Icon: LayoutDashboard,
				label: m.menu_overview_dashboard(),
				href: resolve('/')
			}
		},
		{
			topTitle: m.menu_hrm(),
			menu: [
				{
					title: m.menu_hrm_employee(),
					Icon: LayoutDashboard,
					links: [
						{ label: 'Submenu 1', href: '/subm' },
						{ label: 'Submenu 2', href: '/1' }
					]
				},
				{
					title: m.menu_hrm_leave(),
					Icon: LayoutDashboard,
					links: [
						{ label: 'Submenu 1', href: '/1' },
						{ label: 'Submenu 2', href: '/1' }
					]
				}
			]
		},
		{
			topTitle: 'AI 管理',
			menu: [
				{
					title: 'AI1',
					Icon: LayoutDashboard,
					links: [
						{ label: 'Submenu 1', href: '/1' },
						{ label: 'Submenu 2', href: '/1' }
					]
				},
				{
					title: 'AI2',
					Icon: LayoutDashboard,
					links: [
						{ label: 'Submenu 1', href: '/1' },
						{ label: 'Submenu 2', href: '/1' }
					]
				}
			]
		},
		{
			topTitle: m.menu_company(),
			menu: {
				Icon: GitFork,
				label: m.menu_company_team(),
				href: resolve('/teams')
			}
		},
		{
			topTitle: '设置',
			menu: [
				{
					title: '设置1',
					Icon: LayoutDashboard,
					links: [
						{ label: 'Submenu 1', href: '/1' },
						{ label: 'Submenu 2', href: '/1' }
					]
				},
				{
					title: '设置2',
					Icon: LayoutDashboard,
					links: [
						{ label: 'Submenu 1', href: '/1' },
						{ label: 'Submenu 2', href: '/1' }
					]
				}
			]
		}
	];
</script>

<aside class="flex h-full flex-col bg-base-200/20 pb-2">
	<header class="sticky top-0 z-10 p-2">
		<a class="mx-2 flex gap-4 rounded-xl p-2 hover:bg-base-200" href={resolve('/')}>
			<!-- Home icon -->
			<img src={logo} alt="Logo" class="max-h-10 max-w-10" />
			<div class="flex flex-col">
				<h1 class="text-lg font-bold">{m.title()}</h1>
				<span class="text-sm text-nowrap">{m.admin_dashboard()}</span>
			</div>
		</a>
	</header>

	<div class="mb-8 grow">
		{#each menuList as menu (menu.topTitle)}
			<MenuList topTitle={menu.topTitle} menu={menu.menu}></MenuList>
		{/each}
	</div>

	<div class="sticky bottom-0">
		<UserCard />
	</div>
</aside>
