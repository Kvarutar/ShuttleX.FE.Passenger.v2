import i18next from 'i18next';
import { initReactI18next } from "react-i18next";
import { getLocales } from 'react-native-localize';
import resources from './i18n.config';

i18next
	.use(initReactI18next)
	.init({
		compatibilityJSON: 'v3',
		lng: getLocales()[0]?.languageCode,
		resources,
		supportedLngs: [ 'en', 'ru', 'he' ],
		fallbackLng: "en",
		interpolation: {
			escapeValue: false, 
		},
	});

export default i18next;
