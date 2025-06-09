import { TimeView } from '@mui/x-date-pickers';
import { PickersLocaleText } from '@mui/x-date-pickers/locales';

import { getTranslation } from '@/utils/getTranslation';

export const DateFormat = 'DD/MM/YYYY';
export const HourFormat = 'HH:mm';
export const DateTimeFormat = 'DD/MM/YYYY, HH:mm';
export const ISOFormat = 'YYYY-MM-DDTHH:mm:ss[Z]';

const t = getTranslation('date');

export const DateTimeLocaleText = (): Partial<PickersLocaleText<any>> => ({
  // Existing translations
  previousMonth: t('previous_month'),
  nextMonth: t('next_month'),
  cancelButtonLabel: t('cancel_button_label'),
  clearButtonLabel: t('clear_button_label'),
  okButtonLabel: t('ok_button_label'),
  todayButtonLabel: t('today_button_label'),
  

  // Additional translations
  start: t('start'),
  end: t('end'),

  // Correct type for clockLabelText
  clockLabelText: (view: TimeView, time: any, adapter: any) => {
    switch (view) {
      case 'hours':
        return t('clock_label_text.hours');
      case 'minutes':
        return t('clock_label_text.minutes');
      case 'seconds':
        return t('clock_label_text.seconds');
      default:
        return t('clock_label_text.default');
    }
  },

  hoursClockNumberText: (hours: string) => t('hours_clock_number_text', { hours }),
  minutesClockNumberText: (minutes: string) => t('minutes_clock_number_text', { minutes }),
  secondsClockNumberText: (seconds: string) => t('seconds_clock_number_text', { seconds }),
});
