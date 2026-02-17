"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { translations, getTranslation } from '../i18n/translations';

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('ru');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedLang = localStorage.getItem('stroymarket_lang');
        if (storedLang && (storedLang === 'ru' || storedLang === 'ky' || storedLang === 'en')) {
            setLang(storedLang);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('stroymarket_lang', lang);
        }
    }, [lang, isLoaded]);

    const switchLanguage = (newLang) => {
        if (newLang === 'ru' || newLang === 'ky' || newLang === 'en') {
            setLang(newLang);
        }
    };

    const t = (key) => getTranslation(lang, key);

    const value = {
        lang,
        switchLanguage,
        t,
        translations: translations[lang],
        isLoaded,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
