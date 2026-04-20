import { db } from '$lib/server/db';
import { logger } from '$lib/server/logger';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

export async function seed() {
	/*
INSERT INTO public."user"
(id, "name", email, email_verified, image, created_at, updated_at, username, display_username, phone_number, phone_number_verified)
VALUES('OMwGsAJGMjHYqtymtZvaFckUyuz3WYsY', 'admin@qq.com', 'admin@qq.com', false, NULL, '2026-04-19 16:37:35.222', '2026-04-19 16:37:35.222', 'admin', 'admin', NULL, NULL);
    */
	/*
INSERT INTO public.account
(id, account_id, provider_id, user_id, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, "scope", "password", created_at, updated_at)
VALUES('fU12WWLxVO8Jek0Mrbg2N0769RGxdSWx', 'OMwGsAJGMjHYqtymtZvaFckUyuz3WYsY', 'credential', 'OMwGsAJGMjHYqtymtZvaFckUyuz3WYsY', NULL, NULL, NULL, NULL, NULL, NULL, 'fabfad8ed9b81ef094350f9d56c69e10:393e6b49a08fbe34c892fa43081b8d3fae5ccb101bf00ed4347a4da8eafbdc30c00c477a96596fa6c1f704265382e829fc9fc925c20f08cc3706f354ce34d95f', '2026-04-19 16:37:35.228', '2026-04-19 16:37:35.228');
     */

	logger.info('⏳ Seeding database...');

	// 1. 检查并插入管理员用户
	const adminId = 'OMwGsAJGMjHYqtymtZvaFckUyuz3WYsY';
	const existingUser = await db.query.user.findFirst({
		where: eq(schema.user.id, adminId)
	});

	if (!existingUser) {
		await db.insert(schema.user).values({
			id: adminId,
			name: 'admin@qq.com',
			email: 'admin@qq.com',
			emailVerified: false,
			createdAt: new Date('2026-04-19 16:37:35.222'),
			updatedAt: new Date('2026-04-19 16:37:35.222'),
			username: 'admin',
			displayUsername: 'admin'
		});
		logger.info('✅ Admin user created');
	} else {
		logger.info('ℹ️ Admin user already exists');
	}

	// 2. 检查并插入管理员账号
	const accountId = 'fU12WWLxVO8Jek0Mrbg2N0769RGxdSWx';
	const existingAccount = await db.query.account.findFirst({
		where: eq(schema.account.id, accountId)
	});

	if (!existingAccount) {
		await db.insert(schema.account).values({
			id: accountId,
			accountId: adminId,
			providerId: 'credential',
			userId: adminId,
			password:
				'fabfad8ed9b81ef094350f9d56c69e10:393e6b49a08fbe34c892fa43081b8d3fae5ccb101bf00ed4347a4da8eafbdc30c00c477a96596fa6c1f704265382e829fc9fc925c20f08cc3706f354ce34d95f',
			createdAt: new Date('2026-04-19 16:37:35.228'),
			updatedAt: new Date('2026-04-19 16:37:35.228')
		});
		logger.info('✅ Admin account created');
	} else {
		logger.info('ℹ️ Admin account already exists');
	}

	// 3. 检查并插入示例任务
	const tasksToSeed = [
		{ title: '完成项目初始化', priority: 1 },
		{ title: '配置数据库种子', priority: 2 },
		{ title: '实现用户登录功能', priority: 1 }
	];

	for (const task of tasksToSeed) {
		const existingTask = await db.query.task.findFirst({
			where: eq(schema.task.title, task.title)
		});

		if (!existingTask) {
			await db.insert(schema.task).values(task);
			logger.info(`✅ Task created: ${task.title}`);
		}
	}

	logger.info('🚀 Seeding process finished!');
}
