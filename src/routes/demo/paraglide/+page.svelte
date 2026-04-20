<script lang="ts">
	import { setLocale } from '$lib/paraglide/runtime';
</script>

<div>
	<button onclick={() => setLocale('zh')}>zh</button>
	<button onclick={() => setLocale('en')}>en</button>
</div>

<p>
	If you use VSCode, install the

	<a
		href="https://marketplace.visualstudio.com/items?itemName=inlang.vs-code-extension"
		target="_blank">Sherlock i18n extension</a
	>

	for a better i18n experience.
</p>
