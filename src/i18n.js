import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pl from './locales/pl/pl.json';
import en from './locales/en/en.json';

const resources = {
  pl: { translation: pl },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pl',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;