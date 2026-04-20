import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "../constants/translations/en.json";
import arTranslations from "../constants/translations/ar.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslations,
            },
            ar: {
                translation: arTranslations,
            },
        },
        fallbackLng: "en",
        load: 'languageOnly',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
        },
    });

// Handle RTL for Arabic
i18n.on('languageChanged', (lng) => {
    const isRtl = lng.startsWith('ar');
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

// Initial set
const currentLang = i18n.language || 'en';
document.documentElement.dir = currentLang.startsWith('ar') ? 'rtl' : 'ltr';
document.documentElement.lang = currentLang;

export default i18n;
