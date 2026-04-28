<script module>
	export type UserQuestionProps = {
		txt: string;
		imgs: string[];
	};
</script>

<script lang="ts">
	let { txt }: UserQuestionProps = $props();
</script>

<div class="chat-end chat">
	<div class="chat-bubble chat-bubble-info">{txt}</div>
</div>
