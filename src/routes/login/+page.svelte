<script lang="ts">
	import { authClient } from '$lib/client/auth';
	import { Mail, User, Lock, Loader } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';

	let activeTab = $state('password'); // 'password' | 'phone'
	let identifier = $state(''); // 用户名或邮箱
	let password = $state('');
	let loading = $state(false);
	let errorMessage = $state('');

	async function handlePasswordLogin() {
		if (loading) return;
		loading = true;
		errorMessage = '';
		try {
			const isEmail = identifier.includes('@');
			let result;
			if (isEmail) {
				result = await authClient.signIn.email({
					email: identifier,
					password,
					callbackURL: '/'
				});
			} else {
				result = await authClient.signIn.username({
					username: identifier,
					password,
					callbackURL: '/'
				});
			}

			if (result?.error) {
				errorMessage = result.error.message || '登录失败';
			} else {
				goto(resolve('/'));
			}
		} catch (e: unknown) {
			errorMessage = e instanceof Error ? e.message : '发生未知错误';
		} finally {
			loading = false;
		}
	}

	// async function handlePasskeyLogin() {
	// 	{
	// 		let { data, error } = await authClient.passkey.addPasskey({
	// 			name: '我的 YubiKey',
	// 			authenticatorAttachment: 'cross-platform'
	// 		});
	// 		console.log('Passkey login result:', { data, error });
	// 	}

	// 	{
	// 		const { data, error } = await authClient.signIn.passkey();
	//         console.log('Passkey sign-in result:', { data, error });
	// 	}
	// }

	async function handleSignUp() {
		await authClient.signUp.email({
			email: identifier,
			password,
			name: identifier,
			callbackURL: '/'
		});
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-base-200 p-4">
	<div class="card w-full max-w-md bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="mb-4 card-title justify-center text-2xl font-bold">{m.title()}</h2>

			<!-- Tabs -->
			<div role="tablist" class="tabs-lifted mb-6 tabs">
				<button
					role="tab"
					class="tab {activeTab === 'password' ? 'tab-active' : ''}"
					onclick={() => (activeTab = 'password')}
				>
					密码登录
				</button>
				<!-- <button
					role="tab"
					class="tab {activeTab === 'phone' ? 'tab-active' : ''}"
					onclick={() => (activeTab = 'phone')}
				>
					验证码登录
				</button> -->
			</div>

			{#if errorMessage}
				<div class="mb-4 alert py-2 alert-error">
					<span class="text-sm">{errorMessage}</span>
				</div>
			{/if}

			<!-- {#if activeTab === 'password'} -->
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handlePasswordLogin();
				}}
				class="space-y-4"
			>
				<div class="form-control">
					<label class="label" for="identifier">
						<span class="label-text">用户名或邮箱</span>
					</label>
					<div class="input-bordered input flex items-center gap-2">
						{#if identifier.includes('@')}
							<Mail size={18} class="opacity-70" />
						{:else}
							<User size={18} class="opacity-70" />
						{/if}
						<input
							id="identifier"
							type="text"
							class="grow"
							placeholder="输入用户名或邮箱"
							bind:value={identifier}
							autocomplete="username webauthn"
							required
						/>
					</div>
				</div>

				<div class="form-control">
					<label class="label" for="password">
						<span class="label-text">密码</span>
					</label>
					<div class="input-bordered input flex items-center gap-2">
						<Lock size={18} class="opacity-70" />
						<input
							id="password"
							type="password"
							class="grow"
							placeholder="••••••••"
							bind:value={password}
							autocomplete="current-password webauthn"
							required
						/>
					</div>
				</div>

				<div class="mt-6 card-actions">
					<button type="submit" class="btn w-full btn-primary" disabled={loading}>
						{#if loading}
							<Loader class="animate-spin" size={18} />
						{/if}
						登录
					</button>
					<button
						type="button"
						class="btn w-full btn-primary"
						disabled={loading}
						onclick={handleSignUp}
					>
						{#if loading}
							<Loader class="animate-spin" size={18} />
						{/if}
						注册
					</button>
					<!--  -->
				</div>
			</form>
		</div>
	</div>
</div>
