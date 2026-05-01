import { customType } from 'drizzle-orm/pg-core';
import { DateTime } from 'luxon';
/**
 * 自定义 Luxon DateTime 类型
 */
export const luxonTimestamp = customType<{ data: DateTime; driverData: Date }>({
	dataType() {
		return 'timestamp with time zone';
	},
	toDriver(value: DateTime): Date {
		return value.toJSDate();
	},
	fromDriver(value: Date): DateTime {
		return DateTime.fromJSDate(value);
	}
});
