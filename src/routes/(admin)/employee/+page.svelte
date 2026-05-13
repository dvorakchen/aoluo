<script lang="ts">
	import { resolve } from '$app/paths';
	import Pagination from '$lib/components/pagination.svelte';
	import Table from '$lib/components/table.svelte';
	import UserAvatar from '$lib/components/user-avatar.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { User } from '$lib/shared';
	import { page } from '$app/state';
	import Input from '$lib/components/input.svelte';
	import { toDateTime } from '$lib/shared/utils';
	import UserStateBadge from '$lib/components/user-state-badge.svelte';
	import { guard } from '$lib/client/permission/attachments/permission-guard.js';
	import { UserCog, Users } from '@lucide/svelte';

	let { data } = $props();

	type RowType = User & { checked: boolean };

	let list: (User & { checked: boolean })[] = $derived.by(() => {
		return data.users.map((user: User) => {
			let checked = $state(false);
			return {
				...user,
				get checked() {
					return checked;
				},
				set checked(v) {
					checked = v;
				}
			};
		});
	});
</script>

<div class="mb-8 flex items-center gap-4">
	<div class="rounded-xl bg-primary/10 p-3">
		<Users class="text-primary" size={28} />
	</div>
	<div>
		<h1 class="text-2xl font-bold tracking-tight">{m.employee_list()}</h1>
		<p class="text-sm font-medium opacity-60">{m.menu_hrm_employee()}</p>
	</div>
</div>

<form class="mx-4 mt-6 flex" method="GET">
	<div class="flex gap-4">
		<Input
			label={m.username()}
			clearable={true}
			type="text"
			name="displayusername"
			value={page.url.searchParams.get('displayusername')}
		/>
		<Input
			label={m.email()}
			clearable={true}
			type="text"
			name="email"
			value={page.url.searchParams.get('email')}
		/>
		<Input
			label={m.phone()}
			clearable={true}
			type="text"
			name="phone"
			value={page.url.searchParams.get('phone')}
		/>
		<div class="filter">
			<input
				class="filter-reset btn btn-outline btn-secondary"
				type="radio"
				name="removed"
				aria-label="X"
				value=""
			/>
			<input
				class="btn checked:btn-secondary"
				type="radio"
				name="removed"
				aria-label={m.resigned()}
				value="on"
			/>
			<input
				class="btn checked:btn-secondary"
				type="radio"
				name="removed"
				aria-label={m.not_resigned()}
				value="off"
			/>
		</div>

		<div class="filter">
			<input
				class="filter-reset btn btn-outline btn-secondary"
				type="radio"
				name="banned"
				aria-label="X"
				value=""
			/>
			<input
				class="btn checked:btn-secondary"
				type="radio"
				name="banned"
				aria-label={m.banned_status()}
				value="on"
			/>
			<input
				class="btn checked:btn-secondary"
				type="radio"
				name="banned"
				aria-label={m.not_banned_status()}
				value="off"
			/>
		</div>
		<input type="number" name="page" hidden />
	</div>
	<div class="flex">
		<button class="btn shadow btn-primary" type="submit">{m.search()}</button>
	</div>
</form>

<Table
	checkable={true}
	columns={[
		{ field: 'display_name', display: m.display_name() },
		{ field: 'email', display: m.email() },
		{ field: 'phoneNumber', display: m.phone() },
		{ field: 'status', display: m.status() },
		{ field: 'createdAt', display: m.created_at() }
	]}
	{list}
>
	{#snippet display_name(row: RowType)}
		<div class="flex items-center gap-3">
			<UserAvatar image={row.image} displayUsername={row.displayUsername ?? ''} />
			<div class="flex flex-col">
				<span class="font-medium">{row.displayUsername || row.name}</span>
				<span class="text-xs text-base-content/50">@{row.username}</span>
			</div>
		</div>
	{/snippet}

	{#snippet email(row: RowType)}
		<a class="btn btn-link" href="mailto:{row.email}">{row.email}</a>
	{/snippet}

	{#snippet phoneNumber(row: RowType)}
		<span>{row.phoneNumber || m.not_set()}</span>
	{/snippet}

	{#snippet status(row: RowType)}
		<UserStateBadge user={row} />
	{/snippet}

	{#snippet createdAt(row: RowType)}
		<span>{toDateTime(row.createdAt)}</span>
	{/snippet}

	{#snippet actions(row: RowType)}
		<div class="flex gap-2">
			<a
				class="btn btn-soft"
				href={resolve(`/employee/${row.username}`)}
				{@attach guard('EMPLOYEE_READ')}
			>
				<UserCog size={18} />{m.details()}
			</a>
			<!-- <button class="btn text-error btn-ghost" {@attach guard('EMPLOYEE_DELETE')}
				>{m.delete_employee()}</button
			> -->
		</div>
	{/snippet}
</Table>

<div class="mt-6 flex">
	<Pagination page={1} totalPages={30} />
</div>
