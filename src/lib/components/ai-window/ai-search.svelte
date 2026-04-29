<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Bot } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { ChatBubble, ChatContext } from './context';
	import { wsClient } from '$lib/client/websocket/index';
	import UserInput, { focus as focusUserInput, reset as resetUserInput } from './user-input.svelte';
	import ChatListBox from './chat-list-box.svelte';
	import type { RxDataAiChat } from '$lib/client/websocket/model';
	import { subscribeAiChatRx } from './ai-search';

	let dialog = $state<HTMLDialogElement>();
	let chatContext: ChatContext = ChatContext.new();

	onMount(() => {
		wsClient.connect();

		return wsClient.subscribe('ai-chat', subscribe);
	});

	const subscribe = (payload: RxDataAiChat) => {
		console.log('接收到 ai-chat 订阅: ', payload);

		if (payload.type === 'end' || payload.type === 'unknow') {
			chatContext.end();
			resetUserInput();
			return;
		}
		subscribeAiChatRx(chatContext, payload);
	};

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
		chatContext.end();
		chatContext.chatList.push(ChatBubble.fromUser(txt, imgs));

		wsClient.send('ai-chat', {
			type: 'txt-imgs',
			data: {
				txt,
				imgs
			}
		});
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

			<ChatListBox {chatContext} />

			<UserInput {onSend} />
		</div>
	</div>
</dialog>
