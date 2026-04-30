<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();

	let items = $derived.by(() => {
		return data.teams.map((team) => {
			let check = $state(false);
			return {
				...team,
				get check() {
					return check;
				},
				set check(v) {
					check = v;
				}
			};
		});
	});

	// 计算是否全选
	let isAllChecked = $derived(items.length > 0 && items.every((t) => t.check));

	// 处理全选点击
	function toggleAll(e: Event) {
		const checked = (e.target as HTMLInputElement).checked;
		items.forEach((t) => (t.check = checked));
	}
</script>

<h1>部门管理</h1>
<div class="overflow-x-auto">
	<table class="table">
		<!-- head -->
		<thead>
			<tr>
				<th>
					<label>
						<input type="checkbox" class="checkbox" checked={isAllChecked} onchange={toggleAll} />
					</label>
				</th>
				<th>部门名</th>
				<th>负责人</th>
				<th>人数</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each items as team (team.id)}
				<tr class="hover:bg-base-300">
					<th>
						<label>
							<input type="checkbox" class="checkbox" bind:checked={team.check} />
						</label>
					</th>
					<td>{team.name}</td>
					<td>{team.name}</td>
					<td>{team.memberCount}</td>
					<td>
						<a class="btn" href={resolve(`/teams/${team.id}`)}>详情</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
