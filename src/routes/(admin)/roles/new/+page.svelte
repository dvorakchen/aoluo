<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { ShieldCheck, ChevronLeft, Save, Info } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import Input from '$lib/components/input.svelte';
	import {
		PERMISSIONS,
		getPermissionLabel,
		PERMISSION_CATEGORY_LABELS,
		type PermissionValue
	} from '$lib/shared/permissions';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { toastStore } from '$lib/client/store/toast.svelte';
	import { guard } from '$lib/client/permission/attachments/permission-guard';

	let { form }: { form: ActionData } = $props();

	$effect(() => {
		if (form?.message) {
			toastStore.add(form.message, 'error');
		}
	});

	let permissions = $state<PermissionValue[]>([]);

	const categories = Object.keys(PERMISSIONS) as (keyof typeof PERMISSIONS)[];

	function togglePermission(perm: PermissionValue) {
		if (permissions.includes(perm)) {
			permissions = permissions.filter((p) => p !== perm);
		} else {
			permissions = [...permissions, perm];
		}
	}

	function isChecked(perm: PermissionValue) {
		return permissions.includes(perm);
	}
</script>

<form class="flex h-full flex-col gap-6 p-6" method="POST" use:enhance>
	<!-- Header -->
	<header class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href={resolve('/roles')} class="btn btn-circle btn-ghost">
				<ChevronLeft size={24} />
			</a>
			<div class="rounded-xl bg-primary/10 p-3 text-primary">
				<ShieldCheck size={32} />
			</div>
			<div>
				<h1 class="text-2xl font-bold">{m.role()} - {m.create_role()}</h1>
				<p class="text-sm text-base-content/60">{m.role_create_desc()}</p>
			</div>
		</div>
		<button class="btn gap-2 btn-primary" type="submit" {@attach guard('ROLE_CREATE')}>
			<Save size={18} />
			{m.confirm()}
		</button>
	</header>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Role Info -->
		<div class="space-y-6 lg:col-span-1">
			<section class="card bg-base-100 shadow-xl">
				<div class="card-body gap-4">
					<h2 class="card-title text-base-content/70">
						<Info size={20} />
						{m.basic_info()}
					</h2>

					<div class="form-control w-full">
						<Input
							label={m.name_zh()}
							name="nameZh"
							placeholder={m.placeholder_name_zh()}
							required
							className="w-full"
						/>
					</div>

					<div class="form-control w-full">
						<Input
							label={m.name_en()}
							name="nameEn"
							placeholder={m.placeholder_name_en()}
							required
							className="w-full"
						/>
					</div>
				</div>
			</section>
		</div>

		<!-- Permissions Management -->
		<div class="space-y-6 lg:col-span-2">
			<section class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="mb-4 card-title">
						<ShieldCheck size={20} class="text-primary" />
						{m.permissions()}
					</h2>

					<div class="space-y-8">
						{#each categories as category (category)}
							<div>
								<h3 class="mb-4 text-sm font-bold tracking-wider text-base-content/50 uppercase">
									{PERMISSION_CATEGORY_LABELS[category]?.() ?? category}
								</h3>
								<div class="ml-2 grid grid-cols-1 gap-4 md:grid-cols-2">
									{#each Object.values(PERMISSIONS[category]) as value (value)}
										<label
											class="label cursor-pointer justify-start gap-4 rounded-lg p-2 transition-colors hover:bg-base-200"
										>
											<input
												type="checkbox"
												class="checkbox checkbox-primary"
												checked={isChecked(value as PermissionValue)}
												onchange={() => togglePermission(value as PermissionValue)}
											/>
											<span class="label-text flex flex-col">
												<span class="text-base font-medium"
													>{getPermissionLabel(value as PermissionValue)}</span
												>
												<span class="font-mono text-xs text-base-content/40">{value}</span>
											</span>
										</label>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</section>
		</div>
	</div>

	<input type="hidden" name="permissions" value={JSON.stringify(permissions)} />
</form>
