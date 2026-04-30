<script lang="ts">
	import UserAvatar from '$lib/components/user-avatar.svelte';
	import { m } from '$lib/paraglide/messages';
	import { MoveLeft, Users, User as UserIcon } from '@lucide/svelte';

	let { data } = $props();
	const team = $derived(data.team);
	const members = $derived(
		data.members.sort((a, b) => {
			if (a.id === team.managerId) return -1;
			if (b.id === team.managerId) return 1;
			return 0;
		})
	);
</script>

<div class="mb-6 flex items-center gap-4">
	<a href="/teams" class="btn gap-2 btn-ghost btn-sm">
		<MoveLeft size={18} />
		{m.back_to_list({ name: m.team() })}
	</a>
</div>

{#if team}
	<div class="grid gap-6 md:grid-cols-3">
		<!-- 核心信息卡片 -->
		<div class="card bg-base-100 shadow-all md:col-span-2">
			<div class="card-body">
				<div class="ml-4 grid grid-cols-1 grid-rows-2">
					<h1 class="card-title text-3xl font-bold">{team.name}</h1>
					<p class="mt-2 text-base-content/60">ID: {team.id}</p>
				</div>

				<div class="divider"></div>

				<div class="ml-4 grid gap-4 sm:grid-cols-2">
					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-primary/10 p-3 text-primary">
							<UserIcon size={24} />
						</div>
						<div>
							<p class="text-sm text-base-content/60">负责人</p>
							<p class="font-semibold">{team.manager?.displayUsername || '未设置'}</p>
						</div>
					</div>

					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-secondary/10 p-3 text-secondary">
							<Users size={24} />
						</div>
						<div>
							<p class="text-sm text-base-content/60">成员数量</p>
							<p class="font-semibold">{team.memberCount} 人</p>
						</div>
					</div>
				</div>

				<!-- 成员列表部分 -->
				<div class="mt-8">
					<h3 class="mb-4 ml-4 flex items-center gap-2 text-xl font-bold">
						<Users size={20} />
						部门成员
					</h3>
					<div class="overflow-x-auto">
						<table class="table w-full">
							<thead>
								<tr>
									<th>成员</th>
									<th>用户名</th>
									<th>角色</th>
								</tr>
							</thead>
							<tbody>
								{#each members as member (member.id)}
									<tr class="hover:bg-base-200">
										<td>
											<div class="flex items-center gap-3">
												<UserAvatar
													image={member.image}
													displayUsername={member.displayUsername ?? ''}
												/>
												<div class="font-bold">{member.displayUsername}</div>
											</div>
										</td>
										<td>{member.username}</td>
										<td>
											{#if member.id === team.managerId}
												<div class="badge badge-sm badge-primary">负责人</div>
											{:else}
												<div class="badge badge-ghost badge-sm">职员</div>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<!-- 侧边操作栏 -->
		<div class="flex flex-col gap-4">
			<div class="card bg-base-100 shadow-all">
				<div class="card-body">
					<h2 class="card-title text-sm tracking-widest text-base-content/50 uppercase">操作</h2>
					<div class="mt-2 flex flex-col gap-2">
						<button class="btn btn-outline btn-primary">编辑部门信息</button>
						<button class="btn btn-outline">管理成员</button>
						<div class="divider"></div>
						<button class="btn btn-outline btn-error">删除部门</button>
					</div>
				</div>
			</div>

			<div class="stats stats-vertical bg-base-100 shadow-xl">
				<div class="stat">
					<div class="stat-title">创建时间</div>
					<div class="stat-value text-sm">
						{new Date(team.createdAt).toLocaleString()}
					</div>
				</div>
				<div class="stat">
					<div class="stat-title">最后更新</div>
					<div class="stat-value text-sm">
						{team.updatedAt ? new Date(team.updatedAt).toLocaleString() : '从未更新'}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
