import { createFetch } from 'ofetch';
import { env } from '$env/dynamic/public';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths'
import { getLocale } from '$lib/paraglide/runtime';

function createHttpInstance() {
    const url = new URL(env.PUBLIC_ORIGIN);
    url.pathname = (url.pathname + '/api').replace('//', '/');

    const api = createFetch().create({
        baseURL: url.href, // 你的后端地址

        // 请求拦截器：每次发请求前自动带上 Token
        onRequest({ /*request,*/ options }) {
            // 客户端语言设置
            options.headers.append('lang', getLocale())
        },

        // 错误拦截器：全局处理特定的报错
        onResponseError({ /*request,*/ response/*, options*/ }) {
            if (response.status === 401) {
                console.error('登录已过期，请重新登录');
                goto(resolve('/login'))
            }
        }
    });

    return api;
}

/**
 * 全局复用的请求实例
 * 
 * 请求地址自动加上 '/api'
 */

export const http = createHttpInstance();

// 以后在组件里就直接用这个封装好的 api
// const users = await http('/users');