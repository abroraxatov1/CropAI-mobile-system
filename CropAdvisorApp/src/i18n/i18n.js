import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uz from './locales/uz';
import en from './locales/en';
import ru from './locales/ru';

const LOCALES = { uz, en, ru };
const STORAGE_KEY = 'cropadvisor.language';
export const SUPPORTED_LANGUAGES = ['uz', 'en', 'ru'];
const DEFAULT_LANGUAGE = 'uz';

const LanguageContext = createContext(null);

function lookup(dict, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), dict);
}

function interpolate(str, params) {
  if (!params) return str;
  return Object.keys(params).reduce(
    (acc, key) => acc.replace(new RegExp(`{${key}}`, 'g'), String(params[key])),
    str
  );
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
          setLanguageState(stored);
        }
      } catch (e) {
        // ignore, fall back to default
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setLanguage = useCallback((lang) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return;
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang).catch(() => {});
  }, []);

  const t = useCallback(
    (key, params) => {
      const dict = LOCALES[language] || LOCALES[DEFAULT_LANGUAGE];
      let value = lookup(dict, key);
      if (value === undefined) {
        // fall back to Uzbek, then to the raw key so missing translations
        // never crash the UI
        value = lookup(LOCALES[DEFAULT_LANGUAGE], key);
      }
      if (value === undefined) return key;
      if (typeof value === 'string') return interpolate(value, params);
      return value;
    },
    [language]
  );

  const value = useMemo(() => ({ language, setLanguage, t, ready }), [language, setLanguage, t, ready]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
