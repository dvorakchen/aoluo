import type { auth } from '$lib/server/auth';
import { type InferSelectModel } from 'drizzle-orm';
import type * as schema from '../server/db/schema';

export * from './permissions';

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;

export type Team = InferSelectModel<typeof schema.team>;
export type Organization = InferSelectModel<typeof schema.organization>;

export const NO_ASSIGNED_TEAM = '未分配Team';

export type PayloadAiChatType = 'txt-img';

export interface AiChatTxtImg {
	txt: string;
	/** 图片链接 */
	img: string;
}

export interface PayloadAiChat {
	type: PayloadAiChatType;
	data: AiChatTxtImg;
}

// --- 2. 映射表：新增消息类型只需在此注册 ---

export type WsPayloadMap = {
	'ai-chat': PayloadAiChat;
};

export type WsMessageType = keyof WsPayloadMap;

/**
 * 服务器返回和客户端发送的标准消息格式
 */
export interface WsMessage<K extends WsMessageType = WsMessageType> {
	type: K;
	payload: WsPayloadMap[K];
}
