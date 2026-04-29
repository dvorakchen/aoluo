import type { TransiferData, RecevieData } from '$lib/client/websocket/model';

/**
 * 服务端 WebSocket 接收的数据类型
 */
export type RxData = TransiferData;

/**
 * 服务端 WebSocket 发送的数据类型
 */
export type TxData = RecevieData;
