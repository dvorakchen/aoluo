/// 这里是 AI Agent 的实现

import { inject, injectable } from 'tsyringe';
import { env } from '$env/dynamic/private';
import type { User } from '$lib/shared';
import { DateTime } from 'luxon';
import type { PermissionService } from '$lib/server/business/permission';
import type { DbService } from '$lib/server/db';

@injectable()
export class Agent {
    private readonly url: string;
    private readonly model: string;
    private readonly apiKey: string;

    /**
     * AI 使用的数据库绝对不能有删除的权限
     */
    private get db() {
        return this.dbService.db;
    }

    constructor(
        @inject('AiDbService') private dbService: DbService,
        private permissionService: PermissionService
    ) {
        this.url = env.AGENT_URL ?? '';
        this.model = env.AGENT_MODEL ?? '';
        this.apiKey = env.AGENT_KEY ?? '';
    }

    /**
     * 和 AI 对话
     * @param user 当前用户，必须登录
     * @param txt 用户的提问，文本
     * @param img 用户可能提交了图片
     */
    async ask(user: User, txt: string, img: string[]) { }

    private async systemPrompt(user: User) {
        const currentDateTime = DateTime.now().toISO();
        const currentUsername = user.username;
        const permissionList = await this.permissionService.getPermissionsByUserId(user.id);

        // TODO: 完成 system prompt
        return `你是一个系统管理员，
    `;
    }
}
