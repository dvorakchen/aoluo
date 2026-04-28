import { initThemeStore } from '$lib/client/store/theme.svelte';
import { initWebSocket } from '$lib/client/websocket';

initThemeStore();
initWebSocket();
