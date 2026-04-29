<script module>
	let btnPending = $state(false);
	let btnDisabled = $derived.by(() => {
		const txt = (userInputValue ?? '').trim();
		return !txt;
	});

	let userInput = $state<HTMLTextAreaElement>();
	let userInputValue = $state('');

	export function focus() {
		userInput?.focus();
	}

	export function reset() {
		btnPending = false;
	}
</script>

<script lang="ts">
	import { wsClient } from '$lib/client/websocket/index';

	import { m } from '$lib/paraglide/messages';
	import { Paperclip, Square } from '@lucide/svelte';

	let {
		onSend
	}: {
		onSend: (txt: string, imgs: []) => void;
	} = $props();

	let preValue = $state('');

	function sendMsg() {
		const txt = (userInputValue ?? '').trim();
		if (!txt || btnDisabled) {
			return;
		}
		preValue = txt;
		userInputValue = '';
		btnPending = true;

		onSend?.(txt, []);
	}

	function stopMsg() {
		if (!btnDisabled) {
			return;
		}
		btnDisabled = false;

		if (!userInputValue) {
			userInputValue = preValue;
		}
		wsClient.send('ai-chat', {
			type: 'cancel',
			data: null
		});
	}
</script>

<div>
	<fieldset class="fieldset">
		<!-- <legend class="fieldset-legend">Your bio</legend> -->
		<textarea
			bind:this={userInput}
			bind:value={userInputValue}
			class="textarea h-24 w-full resize-y"
			placeholder="Bio"
			onkeydown={(ev) => {
				if (!ev.ctrlKey && !ev.shiftKey && ev.key === 'Enter') {
					ev.preventDefault();
					sendMsg();
					return;
				}
			}}
		></textarea>
		<div class="mt-2 flex">
			<div class="label grow">{m.ai_assistant_instruction()}</div>
			<div class="flex gap-2">
				<button class="tooltip btn btn-square" data-tip={`${m.attachment()}`}>
					<Paperclip />
				</button>
				{#if btnPending}
					<button
						class="tooltip btn btn-circle btn-soft btn-primary"
						data-tip={`${m.stop()}`}
						onclick={stopMsg}
					>
						<Square size={16} />
					</button>
				{:else}
					<button class=" btn btn-primary" onclick={sendMsg} disabled={btnDisabled}
						>{m.send()}</button
					>
				{/if}
			</div>
		</div>
	</fieldset>
</div>
