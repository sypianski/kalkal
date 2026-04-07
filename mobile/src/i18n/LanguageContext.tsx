import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { I18nManager, DevSettings } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18N, SUPPORTED_LANGS, RTL_LANGS, getT } from '../engine/i18n';

export type Lang = 'en' | 'pl' | 'ar' | 'eo';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: any;
  isRTL: boolean;
}

const STORAGE_KEY = 'kalkal-lang';

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: I18N.en,
  isRTL: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(saved => {
      if (saved && SUPPORTED_LANGS.includes(saved)) {
        const next = saved as Lang;
        setLangState(next);
        applyRTL(next, false);
      }
    });
  }, []);

  const applyRTL = (next: Lang, reload: boolean) => {
    const shouldBeRTL = RTL_LANGS.includes(next);
    if (I18nManager.isRTL !== shouldBeRTL) {
      try {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
        if (reload && (DevSettings as any)?.reload) {
          // Layout direction only takes effect after reload.
          (DevSettings as any).reload();
        }
      } catch {
        // ignore — falls back to LTR layout, text still renders correctly
      }
    }
  };

  const setLang = (next: Lang) => {
    setLangState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
    applyRTL(next, true);
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t: getT(lang),
        isRTL: RTL_LANGS.includes(lang),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
export const useT = () => useContext(LanguageContext).t;
