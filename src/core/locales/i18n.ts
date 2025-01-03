import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import i18nIntegration from 'shuttlex-integration/src/core/locales/i18n';

import resources from './i18n.config';

i18next
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: getLocales()[0].languageCode,
    resources,
    supportedLngs: ['en', 'uk', 'ru'],
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => i18nIntegration.changeLanguage(getLocales()[0].languageCode));

i18next.on('languageChanged', lng => {
  i18nIntegration.changeLanguage(lng);
});

export default i18next;
