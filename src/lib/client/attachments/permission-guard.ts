import { PermissionSchema, type PermissionValue } from '$lib/shared';
import type { Attachment } from 'svelte/attachments';
import { http } from '$lib/client/http';

/**
 * 权限守卫，只有满足权限才会加载元素
 * @param permissions 需要的权限
 * @returns
 */
export function guard(permissions: PermissionValue | PermissionSchema): Attachment {
	return (element) => {
		element.setAttribute('hidden', 'hidden');

		(async () => {
			let perm = new PermissionSchema();
			if (typeof permissions === 'string') {
				perm.all = [permissions];
			} else if (permissions instanceof PermissionSchema) {
				perm = permissions;
			} else {
				console.log(`Unknow PermissionSchema: `, permissions);
			}

			const res: { has: boolean } = await http('/has-permissions', {
				method: 'POST',
				body: perm
			});

			if (res.has) {
				element.removeAttribute('hidden');
			} else {
				element.remove();
			}
		})();
	};
}
