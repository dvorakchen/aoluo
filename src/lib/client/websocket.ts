import { env as pubenv } from '$env/dynamic/public';
import type { WsMessage, WsMessageType, WsPayloadMap } from '$lib/shared';

/**
 * 订阅回调类型
 */ type Callback<Payload> = (payload: Payload) => void;

// --- 3. 客户端工厂 ---

export function createWebSocketClient(url: string) {
	let socket: WebSocket | null = null;
	let isConnected = false;

	// 存储不同类型的订阅者
	const subscribers = new Map<WsMessageType, Set<Callback<unknown>>>();

	/**
	 * 订阅指定类型的消息
	 */
	function subscribe<K extends WsMessageType>(type: K, callback: Callback<WsPayloadMap[K]>) {
		if (!subscribers.has(type)) {
			subscribers.set(type, new Set());
		}
		const internalCallback = callback as Callback<unknown>;

		subscribers.get(type)!.add(internalCallback);

		return () => {
			subscribers.get(type)?.delete(internalCallback);
		};
	}

	/**
	 * 发布消息给订阅者
	 */
	function publish<K extends WsMessageType>(type: K, payload: WsPayloadMap[K]) {
		const targets = subscribers.get(type);
		if (targets) {
			targets.forEach((cb) => cb(payload));
		}
	}

	function connect() {
		if (socket || !url) return;

		socket = new WebSocket(url);

		socket.onopen = () => {
			isConnected = true;
			console.log('🌐 WebSocket 已连接');
		};

		socket.onmessage = (event) => {
			try {
				const data: WsMessage = JSON.parse(event.data);
				if (data.type) {
					publish(data.type, data.payload);
				}
			} catch (error) {
				console.error('WebSocket 消息解析失败', error);
			}
		};

		socket.onclose = () => {
			isConnected = false;
			socket = null;
			console.log('🌐 WebSocket 已断开');
		};
	}

	/**
	 * 发送强类型消息
	 */
	function send<K extends WsMessageType>(type: K, payload: WsPayloadMap[K]) {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify({ type, payload }));
		} else {
			console.warn('WebSocket 未连接，无法发送消息');
		}
	}

	return {
		get isConnected() {
			return isConnected;
		},
		connect,
		send,
		subscribe
	};
}

export let wsClient: ReturnType<typeof createWebSocketClient>;

export function initWebSocket() {
	// 将 HTTP/HTTPS 转换为 WS/WSS
	const wsUrl = pubenv.PUBLIC_ORIGIN.replace(/^http/, 'ws');
	const path = wsUrl + (wsUrl.endsWith('/') ? '' : '/') + `ws`;
	wsClient = createWebSocketClient(path);
}
