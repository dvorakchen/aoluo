import { DateTime } from 'luxon';
import type { DbI18nField } from '$lib/shared';
import { getLocale } from '$lib/paraglide/runtime';
import { v7 } from 'uuid';

export function uuid() {
	return v7();
}

/**
 * 格式化 ISO 日期
 */
export function toDate(datetime: string | Date) {
	return DateTime.fromJSDate(new Date(datetime)).toISODate();
}

/**
 * 格式化 ISO 日期 + HH:mm
 */
export function toDateTime(datetime: string | Date) {
	const dt = DateTime.fromJSDate(new Date(datetime));
	return dt.toISO({ precision: 'day', includeOffset: false }) + ' ' + dt.toFormat('HH:mm');
}

export function i18nFromJSON(json: DbI18nField): string {
	const loca = json[getLocale()];

	if (loca && typeof loca === 'string') {
		return loca;
	}

	return json.default;
}
