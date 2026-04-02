import { useTranslation } from 'react-i18next';

/**
 * useLanguage - Custom hook for language management
 * Provides convenient access to i18n translation and language switching
 * 
 * Usage:
 * const { t, language, setLanguage } = useLanguage();
 * 
 * <p>{t('home.title')}</p>
 * <button onClick={() => setLanguage('es')}>Español</button>
 */
export const useLanguage = () => {
  const { t, i18n } = useTranslation();

  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const language = i18n.language || 'en';
  const isSpanish = language.startsWith('es');
  const isEnglish = language.startsWith('en');

  return {
    t,
    language,
    setLanguage,
    isSpanish,
    isEnglish,
    i18n,
  };
};

export default useLanguage;
