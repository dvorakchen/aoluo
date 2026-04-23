<script>
	import { themeStore } from '$lib/client/store/theme.svelte';
	import { MoonStar, Sun } from '@lucide/svelte';
</script>

<button class="btn btn-square btn-ghost">
	<label class="swap swap-rotate items-center">
		<input
			type="checkbox"
			class="theme-controller"
			value="synthwave"
			onchange={() => themeStore.toggle()}
		/>

		<!-- sun icon -->
		<Sun class="swap-off h-7 w-7 fill-current" />

		<!-- moon icon -->
		<MoonStar class="swap-on h-7 w-7 fill-current" />
	</label>
</button>
