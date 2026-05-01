import { customType } from 'drizzle-orm/pg-core';
import { DateTime } from 'luxon';
/**
 * 自定义 Luxon DateTime 类型
 */
export const luxonTimestamp = customType<{ data: DateTime; driverData: string }>({
	dataType() {
		return 'timestamp with time zone';
	},
	toDriver(value: DateTime): string {
		return value.toISO()!;
	},
	fromDriver(value: string): DateTime {
		return DateTime.fromISO(value);
	}
});
