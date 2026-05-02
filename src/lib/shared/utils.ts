import { DateTime } from 'luxon';
import type { DbI18nField } from '$lib/shared';
import { getLocale } from '$lib/paraglide/runtime';

export function uuid() {
	return crypto.randomUUID();
}

export function toDate(datetime: string | Date) {
	return DateTime.fromJSDate(new Date(datetime)).toISODate();
}

export function i18nFromJSON(json: DbI18nField): string {
	let loca = json[getLocale()];

	if (loca && typeof loca === 'string') {
		return loca;
	}

	return json.default;
}