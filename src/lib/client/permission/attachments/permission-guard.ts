import { PermissionSchema, type PermissionValue } from '$lib/shared';
import type { Attachment } from 'svelte/attachments';
import { http } from '$lib/client/http';
import { browser } from '$app/environment';

// 页面加载时清理过期的缓存（防止页面刷新导致 setTimeout 失效而留下的残余）
if (browser) {
	const keysToRemove: string[] = [];
	for (let i = 0; i < sessionStorage.length; i++) {
		const key = sessionStorage.key(i);
		if (key?.startsWith('perm_cache_')) {
			keysToRemove.push(key);
		}
	}
	keysToRemove.forEach((key) => sessionStorage.removeItem(key));
}

/**
 * 权限守卫，只有满足权限才会加载元素
 * @param permissions 需要的权限
 * @returns
 */
export function guard(permissions: PermissionValue | PermissionSchema): Attachment {
	return (element) => {
		element.setAttribute('hidden', 'hidden');

		(async () => {
			if (await hasPermissions(permissions)) {
				element.removeAttribute('hidden');
			} else {
				element.remove();
			}
		})();
	};
}

/**
 * 检查当前用户是否有指定的权限策略
 * @param permissions 权限策略
 * @returns 是否有这些权限
 */
export async function hasPermissions(
	permissions: PermissionValue | PermissionSchema
): Promise<boolean> {

	let perm = new PermissionSchema();
	if (typeof permissions === 'string') {
		perm.all = [permissions];
	} else if (permissions instanceof PermissionSchema) {
		perm = permissions;
	} else {
		console.error(`Unknow PermissionSchema: `, permissions);
	}

	const cacheKey = `perm_cache_${JSON.stringify(perm)}`;

	// TODO: 同时有很多请求到达的时候，缓存不起作用，因为在请求得到结果前就有其他请求到来
	// 需要一个 Set 或者 Map 对象来阻塞相同的请求，`cacheKey` 为 key，如果 key 存在，说明正在获取是否有这个权限，阻塞，可能用Promise 来阻塞
	// 直到拿到结果

	const cached = sessionStorage.getItem(cacheKey);

	if (cached !== null) {
		return cached === 'true';
	}

	const res: { has: boolean } = await http('/has-permissions', {
		method: 'POST',
		body: perm
	});

	sessionStorage.setItem(cacheKey, String(res.has));
	setTimeout(() => {
		sessionStorage.removeItem(cacheKey);
	}, 5000);

	return res.has;
}