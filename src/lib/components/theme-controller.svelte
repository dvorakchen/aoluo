<script>
	import { themeStore } from '$lib/client/store/theme.svelte';
	import { MoonStar, Sun } from '@lucide/svelte';
</script>

<label class="swap swap-rotate">
	<input
		type="checkbox"
		class="theme-controller"
		value="synthwave"
		onchange={() => themeStore.toggle()}
	/>

	<!-- sun icon -->
	<Sun class="swap-off h-8 w-8 fill-current" />

	<!-- moon icon -->
	<MoonStar class="swap-on h-8 w-8 fill-current" />
</label>
