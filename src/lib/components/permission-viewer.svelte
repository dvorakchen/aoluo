<!-- 权限预览 -->
<script lang="ts">
	import { getPermissionLabel, PERMISSIONS, type PermissionValue } from '$lib/shared';
	import { m } from '$lib/paraglide/messages';

	let { permissions }: { permissions: PermissionValue[] } = $props();

	/**
	 * 将权限按类别分组
	 */
	const groupedPermissions = $derived.by(() => {
		const groups: Record<string, PermissionValue[]> = {};

		for (const [category, categoryPerms] of Object.entries(PERMISSIONS)) {
			const permsInCategory = Object.values(categoryPerms).filter((p) =>
				permissions.includes(p as PermissionValue)
			);
			if (permsInCategory.length > 0) {
				groups[category] = permsInCategory as PermissionValue[];
			}
		}
		return groups;
	});

	/**
	 * 权限类别对应的标签
	 */
	const categoryLabels: Record<string, () => string> = {
		team: () => m.team(),
		employee: () => m.employee()
	};
</script>

<div class="flex flex-col gap-4">
	{#each Object.entries(groupedPermissions) as [category, perms] (category)}
		<div class="flex flex-col gap-2">
			<h2 class="font-bold tracking-wider uppercase">
				{categoryLabels[category]?.() ?? category}{m.permissions()}
			</h2>
			<div class="ml-4 flex flex-wrap gap-2">
				{#each perms as perm (perm)}
					<div class="badge badge-info">
						{getPermissionLabel(perm)}
					</div>
				{/each}
			</div>
		</div>
	{/each}

	{#if permissions.length === 0}
		<div class="flex items-center justify-center py-4 text-lg text-base-content/30 italic">
			{m.no_assigned_permission()}
		</div>
	{/if}
</div>
