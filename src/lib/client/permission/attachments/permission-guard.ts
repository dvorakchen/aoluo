import { PermissionSchema, type PermissionValue } from '$lib/shared';
import type { Attachment } from 'svelte/attachments';
import { http } from '$lib/client/http';

// 页面加载时清理过期的缓存（防止页面刷新导致 setTimeout 失效而留下的残余）
export function cleanPermissionCache() {
	const keysToRemove: string[] = [];
	for (let i = 0; i < sessionStorage.length; i++) {
		const key = sessionStorage.key(i);
		if (key?.startsWith('perm_cache_')) {
			keysToRemove.push(key);
		}
	}
	keysToRemove.forEach((key) => sessionStorage.removeItem(key));
	console.debug('clean permission cache');
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

const pendingRequests = new Map<string, Promise<boolean>>();

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

	const cached = sessionStorage.getItem(cacheKey);

	if (cached !== null) {
		return cached === 'true';
	}

	// 如果已经在请求中了，复用正在进行的 Promise
	if (pendingRequests.has(cacheKey)) {
		return pendingRequests.get(cacheKey)!;
	}

	const fetchPromise = (async () => {
		try {
			const res: { has: boolean } = await http('/has-permissions', {
				method: 'POST',
				body: perm
			});

			sessionStorage.setItem(cacheKey, String(res.has));
			setTimeout(() => {
				sessionStorage.removeItem(cacheKey);
			}, 5000);

			return res.has;
		} finally {
			// 无论成功还是失败，请求结束后从等待队列中移除
			pendingRequests.delete(cacheKey);
		}
	})();

	pendingRequests.set(cacheKey, fetchPromise);
	return fetchPromise;
}
