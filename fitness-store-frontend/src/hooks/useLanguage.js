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

  const setLanguage = () => {
    i18n.changeLanguage('en');
  };

  const language = 'en';
  const isSpanish = false;
  const isEnglish = true;

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
