import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import i18nIntegration from 'shuttlex-integration/src/core/locales/i18n';

import resources from './i18n.config';

i18next
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'en',
    resources,
    supportedLngs: ['en'],
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => i18nIntegration.changeLanguage('en'));

i18next.on('languageChanged', lng => {
  i18nIntegration.changeLanguage(lng);
});

export default i18next;
