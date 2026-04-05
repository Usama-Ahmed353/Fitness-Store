import useLanguageHook from '../hooks/useLanguage';

// Backward-compatible export for files still importing LanguageContext.
export const useLanguage = useLanguageHook;

export default useLanguageHook;
