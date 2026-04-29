<script module>
	export type PlainProps = { txt: string };
</script>

<script lang="ts">
	let { txt }: PlainProps = $props();
</script>

<div class="chat-start chat">
	<div class="chat-bubble">
		{txt}
	</div>
</div>
