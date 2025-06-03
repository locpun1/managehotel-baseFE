import dayjs, { Dayjs } from 'dayjs';
// Plugins
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';

import { DateFormat, DateTimeFormat, ISOFormat } from '@/constants/locale';
// Dayjs locale
import 'dayjs/locale/en';
import 'dayjs/locale/vi';

class DateTime {
  constructor() {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(customParseFormat);
    dayjs.extend(updateLocale);
    dayjs.extend(isBetween);
  }

  public initLocale() {
    dayjs.updateLocale('vi', {
      months: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ],
    });
  }

  public IsValid(date: any) {
    if (!date) return false;
    return dayjs(date).isValid();
  }

  public TimeZone() {
    return dayjs.tz.guess();
  }

  public convertToISO(date: Dayjs | string | null = dayjs()) {
    return this.IsValid(date) ? dayjs(date).format(ISOFormat) : null;
  }

  public Format(value: Date | string | Dayjs | null = dayjs(), pattern: string = DateTimeFormat) {
    return this.IsValid(value) ? dayjs(value).format(pattern) : null;
  }
  public FormatDate(value: Date | string | Dayjs | null = dayjs(), pattern: string = DateFormat) {
    return this.IsValid(value) ? dayjs(value).format(pattern) : null;
  }
}

export default new DateTime();
