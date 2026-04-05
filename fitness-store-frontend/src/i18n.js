import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';

/**
 * i18n Configuration
 * - English only
 * - Default: English
 */
const resources = {
  en: {
    translation: enTranslations,
  },
};

i18n
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en'],

    // Check if keys have been set or not
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],

    // React-specific options
    react: {
      useSuspense: true, // Show Suspense fallback while loading translations
    },
  });

export default i18n;
