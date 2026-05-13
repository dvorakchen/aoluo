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
	// 1. 标准化权限参数：确保 permissions 统一转换为 PermissionSchema 实例
	let perm = new PermissionSchema();
	if (typeof permissions === 'string') {
		perm.all = [permissions];
	} else if (permissions instanceof PermissionSchema) {
		perm = permissions;
	} else {
		console.error(`Unknow PermissionSchema: `, permissions);
	}

	// 2. 生成缓存 Key：用于在 sessionStorage 和待处理请求 Map 中标识该权限检查
	const cacheKey = `perm_cache_${JSON.stringify(perm)}`;

	// 3. 检查本地缓存：如果命中且未过期，直接返回结果
	const cached = sessionStorage.getItem(cacheKey);

	if (cached !== null) {
		return cached === 'true';
	}

	// 4. 请求去重：如果相同的权限检查已经在进行中，复用该 Promise 避免重复请求
	if (pendingRequests.has(cacheKey)) {
		return pendingRequests.get(cacheKey)!;
	}

	// 5. 发起网络请求并处理结果
	const fetchPromise = (async () => {
		try {
			// 向服务端验证权限
			const res: { has: boolean } = await http('/has-permissions', {
				method: 'POST',
				body: perm
			});

			// 写入缓存，并设置 5 秒后过期（防止频繁验证，同时也保证了较低的数据延迟）
			sessionStorage.setItem(cacheKey, String(res.has));
			setTimeout(() => {
				sessionStorage.removeItem(cacheKey);
			}, 5000);

			return res.has;
		} finally {
			// 无论请求成功或失败，最后都从 pendingRequests 中移除自己
			pendingRequests.delete(cacheKey);
		}
	})();

	// 记录当前正在进行的请求
	pendingRequests.set(cacheKey, fetchPromise);
	return fetchPromise;
}
