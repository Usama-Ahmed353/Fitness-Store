import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

/**
 * i18n Configuration
 * - Auto-detects browser language (EN/ES)
 * - Falls back to localStorage-persisted language
 * - Persists language selection to localStorage
 * - Default: English
 */
const resources = {
  en: {
    translation: enTranslations,
  },
  es: {
    translation: esTranslations,
  },
};

i18n
  // Use language detector
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    resources,
    fallbackLng: 'en',
    
    // Detection order: localStorage > browser language > fallback
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

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
