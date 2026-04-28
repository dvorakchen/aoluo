<script module>
	let userInput = $state<HTMLTextAreaElement>();

	export function focus() {
		userInput?.focus();
	}
</script>

<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Paperclip, Square } from '@lucide/svelte';

	let {
		onSend
	}: {
		onSend: (txt: string, imgs: []) => void;
	} = $props();

	const SendBtnStatus = {
		enable: 'enable',
		pending: 'pending',
		disable: 'disable'
	} as const;
	type SendBtnStatusType = keyof typeof SendBtnStatus;

	let userInputValue = $state('');
	let preValue = $state('');

	let btnPending = $state(false);
	let sendBtnStatus: SendBtnStatusType = $derived.by(() => {
		if (btnPending) {
			return 'pending';
		}
		const txt = (userInputValue ?? '').trim();
		if (!txt) {
			return 'disable';
		}
		return SendBtnStatus.enable as SendBtnStatusType;
	});

	function sendMsg() {
		const txt = (userInputValue ?? '').trim();
		if (!txt || sendBtnStatus !== 'enable') {
			return;
		}
		preValue = txt;
		userInputValue = '';
		btnPending = true;

		onSend?.(txt, []);
	}

	function stopMsg() {
		sendBtnStatus = 'enable';
		if (!userInputValue) {
			userInputValue = preValue;
		}
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
				{#if sendBtnStatus === 'pending'}
					<button
						class="tooltip btn btn-circle btn-soft btn-primary"
						data-tip={`${m.stop()}`}
						onclick={stopMsg}
					>
						<Square size={16} />
					</button>
				{:else}
					<button class=" btn btn-primary" onclick={sendMsg} disabled={sendBtnStatus !== 'enable'}
						>{m.send()}</button
					>
				{/if}
			</div>
		</div>
	</fieldset>
</div>
