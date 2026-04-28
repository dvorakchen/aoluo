<script module>
	export type PlainProps = { va: string };
</script>

<script lang="ts">
	let { va }: PlainProps = $props();
</script>

<h2>{va}</h2>
