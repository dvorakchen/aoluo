import { DateTime } from 'luxon';

export function uuid() {
	return crypto.randomUUID();
}

export function toDate(datetime: string | Date) {
	return DateTime.fromJSDate(new Date(datetime)).toISODate();
}
