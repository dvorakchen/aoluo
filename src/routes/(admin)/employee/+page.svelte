<script lang="ts">
	import { resolve } from '$app/paths';
	import Table from '$lib/components/table.svelte';
	import UserAvatar from '$lib/components/user-avatar.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { User } from '$lib/shared';

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

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-bold">{m.menu_hrm_employee()}</h1>
</div>

<Table
	checkable={true}
	columns={[
		{ field: 'display_name', display: m.display_name() },
		{ field: 'email', display: m.email() },
		{ field: 'phoneNumber', display: m.phone() },
		{ field: 'createdAt', display: m.created_at() }
	]}
	{list}
>
	{#snippet display_name(row: RowType)}
		<div class="flex items-center gap-3">
			<UserAvatar image={row.image} displayUsername={row.displayUsername ?? ''} />
			<div class="font-bold">{row.displayUsername || row.name}</div>
		</div>
	{/snippet}

	{#snippet email(row: RowType)}
		<span class="text-sm opacity-70">{row.email}</span>
	{/snippet}

	{#snippet phoneNumber(row: RowType)}
		<span>{row.phoneNumber || m.not_set()}</span>
	{/snippet}

	{#snippet actions()}
		<div class="flex gap-2">
			<a class="btn btn-ghost btn-xs" href={resolve(`/employee`)}>{m.details()}</a>
			<button class="btn text-error btn-ghost btn-xs">{m.delete_team()}</button>
		</div>
	{/snippet}
</Table>
