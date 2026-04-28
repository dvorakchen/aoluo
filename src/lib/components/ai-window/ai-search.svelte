<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Bot } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { ChatBubble, type ChatContext } from './context';
	import { wsClient } from '$lib/client/websocket';
	import type { PayloadAiChat } from '$lib/shared';
	import UserInput, { focus as focusUserInput } from './user-input.svelte';

	let dialog = $state<HTMLDialogElement>();

	let chatContext: ChatContext = $state({ chatList: [] });

	onMount(() => {
		const bubble = ChatBubble.fromAi('entoe');
		bubble.pending = true;
		chatContext.chatList.push(bubble);

		wsClient.connect();

		setInterval(() => {
			console.log('send ws');
			wsClient.send('ai-chat', {
				type: 'txt-img',
				data: {
					txt: 'txt',
					img: 'img'
				}
			});
		}, 5000);

		return wsClient.subscribe('ai-chat', (payload: PayloadAiChat) => {
			console.log(payload);
		});
	});

	function openDialog() {
		dialog?.showModal();
		focusUserInput();
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.ctrlKey && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			openDialog();
		}
	}

	function onSend(txt: string, imgs: string[]) {
		chatContext.chatList.push(ChatBubble.fromUser(txt, imgs));
	}
</script>

<svelte:window {onkeydown} />

<label class="input w-50 cursor-pointer ring-offset-2 hover:ring-2">
	<Bot size={32} />
	<input
		type="search"
		class="pointer-events-none grow cursor-pointer"
		placeholder={m.ai_assistant_ask_ai()}
		onclick={openDialog}
	/>
	<kbd class="kbd kbd-sm">⌘</kbd>
	<kbd class="kbd kbd-sm">K</kbd>
</label>
<!-- You can open the modal using ID.showModal() method -->
<dialog bind:this={dialog} class="modal">
	<div class="modal-box h-11/12 w-11/12 max-w-5xl">
		<div class="flex h-full flex-col">
			<form method="dialog">
				<button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm"> ✕ </button>
			</form>
			<h3 class="text-lg font-bold">🤖{m.ai_assistant()}</h3>

			<div class="my-4 grow">
				<ul>
					{#each chatContext.chatList as bubble (bubble.id)}
						<bubble.View {...bubble.props} />
						{#if bubble.pending}
							<div class="mt-4 flex items-center gap-3">
								<span class="loading w-4 loading-spinner"></span>
								<span class="text-sm opacity-80">{m.ai_assistant_handling()}...</span>
							</div>
						{/if}
					{/each}
				</ul>
			</div>

			<UserInput {onSend} />
		</div>
	</div>
</dialog>
