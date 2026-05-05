<script lang="ts">
	import { resolve } from '$app/paths';
	import Table from '$lib/components/table.svelte';
	import type { TeamWithManager } from '$lib/shared';
	import { m } from '$lib/paraglide/messages';

	let { data } = $props();

	type RowType = TeamWithManager & { checked: boolean };

	let list: (TeamWithManager & { checked: boolean })[] = $derived.by(() => {
		return data.teams.map((team: TeamWithManager) => {
			let checked = $state(false);
			return {
				...team,
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

<h1 class="text-2xl font-bold">{m.menu_company_team()}</h1>
<div class="divider"></div>
<div class="card shadow-all">
	<div class="card-body">
		<Table
			columns={[
				{
					field: 'name',
					display: m.team_name()
				},
				{
					field: 'manager',
					display: m.manager()
				},
				{
					field: 'memberCount',
					display: m.member_count()
				}
			]}
			{list}
		>
			{#snippet manager(team: RowType)}
				{team.manager?.displayUsername}
			{/snippet}

			{#snippet actions(team: RowType)}
				<a class="btn" href={resolve(`/teams/${team.name.default}`)}>{m.details()}</a>
			{/snippet}
		</Table>
	</div>
</div>
