import { cleanPermissionCache } from '$lib/client/permission/attachments/permission-guard';
import { initThemeStore } from '$lib/client/store/theme.svelte';
import { initWebSocket } from '$lib/client/websocket';

cleanPermissionCache();
initThemeStore();
initWebSocket();
