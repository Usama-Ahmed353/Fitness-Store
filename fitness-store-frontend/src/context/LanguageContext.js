import { createContext } from 'react';
import useLanguageHook from '../hooks/useLanguage';

// Backward-compatible context object for legacy pages using useContext(LanguageContext).
export const LanguageContext = createContext({
	language: 'en',
	setLanguage: () => {},
});

// Backward-compatible export for files still importing LanguageContext.
export const useLanguage = useLanguageHook;

export default useLanguageHook;
