<script lang="ts">
	import { Languages } from '@lucide/svelte';
	import { setLocale, locales, getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages';

	type Language = (typeof locales)[number];
	async function onChangeLang(lang: Language) {
		if (getLocale() === lang) {
			return;
		}
		await setLocale(lang);
	}
</script>

<div class="dropdown-hover dropdown dropdown-end">
	<div tabindex="0" role="button" class="btn m-1 btn-ghost">
		<Languages />{m.lang()}
	</div>
	<ul tabindex="-1" class="dropdown-content menu z-1 w-52 rounded-box bg-base-100 p-2 shadow-xl">
		{#each locales as locale (locale)}
			<li>
				<button onclick={async () => await onChangeLang(locale)}>{m.lang({}, { locale })}</button>
			</li>
		{/each}
	</ul>
</div>
