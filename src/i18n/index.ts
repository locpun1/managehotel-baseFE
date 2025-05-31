import i18next, { i18n as I18nInstance } from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en'; // thêm nếu cần hỗ trợ nhiều ngôn ngữ

let i18nInstance: I18nInstance;

const NS = ['auth', 'sidebar', 'common', 'customer', 'home', 'section', 'date'];

const initI18n = (): I18nInstance => {
  if (i18nInstance) {
    return i18nInstance;
  }

  const userCache = localStorage.getItem('i18nConfig');
  const langCode = userCache ? JSON.parse(userCache) : navigator.language.split('-')[0];

  i18nInstance = i18next.createInstance();
  i18nInstance
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      lng: langCode,
      fallbackLng: 'en',
      ns: NS,
      defaultNS: 'common',
      interpolation: {
        escapeValue: false, // Tắt escape cho các ký tự đặc biệt
      },
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
    });

      // Đồng bộ dayjs locale với ngôn ngữ hiện tại
    i18nInstance.on('languageChanged', (lng) => {
      dayjs.locale(lng);
    });

      // Thiết lập ban đầu
    dayjs.locale(langCode);

  return i18nInstance;
};

const i18n = initI18n();

export default i18n;
