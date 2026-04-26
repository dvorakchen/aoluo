import { db } from '$lib/server/db';
import { logger } from '$lib/server/logger';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { PUBLIC_ORG_NAME, PUBLIC_ORG_SLUG } from '$env/static/public';

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

	// 1. 检查并插入管理员用户和账号
	const adminEmail = 'admin@qq.com';
	const adminPassword = '123123123';
	const adminUsername = 'admin';

	let adminId: string;
	const existingUser = await db.query.user.findFirst({
		where: eq(schema.user.email, adminEmail)
	});

	if (!existingUser) {
		const result = await auth.api.signUpEmail({
			body: {
				email: adminEmail,
				password: adminPassword,
				name: adminEmail,
				username: adminUsername,
				displayUsername: adminUsername
			}
		});
		adminId = result.user.id;
		logger.info('✅ Admin user and account created via auth API');
	} else {
		adminId = existingUser.id;
		logger.info('ℹ️ Admin user already exists');
	}

	// 2. 检查并插入示例任务
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

	const orgSlug = PUBLIC_ORG_SLUG;
	const existingOrg = await db.query.organization.findFirst({
		where: eq(schema.organization.slug, orgSlug)
	});

	if (!existingOrg) {
		await auth.api.createOrganization({
			body: {
				name: PUBLIC_ORG_NAME,
				slug: orgSlug,
				userId: adminId // 指定创建者（会成为 owner）
			}
		});
		logger.info('✅ Organization created');
	} else {
		logger.info('ℹ️ Organization already exists');
	}

	logger.info('🚀 Seeding process finished!');
}
