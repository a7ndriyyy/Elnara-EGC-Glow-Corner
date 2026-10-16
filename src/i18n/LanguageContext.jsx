import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const LANGUAGE_STORAGE_KEY = "elnara-language";
const SUPPORTED_LANGUAGES = ["en", "fr", "uk", "ru"];

const messages = {
  en: {
    nav: {
      salonServices: "Salon Services",
      study: "Study with us",
      massages: "Massages and Procedures",
      prices: "Prices",
      followUs: "Follow us",
      menu: "Toggle menu",
      closeMenu: "Close menu",
      professional: "Professional area",
      language: "Language",
    },
  },
  fr: {
    nav: {
      salonServices: "Prestations du salon",
      study: "Se former avec nous",
      massages: "Massages et soins",
      prices: "Tarifs",
      followUs: "Suivez-nous",
      menu: "Ouvrir ou fermer le menu",
      closeMenu: "Fermer le menu",
      professional: "Espace professionnel",
      language: "Langue",
    },
  },
  uk: {
    nav: {
      salonServices: "Послуги салону",
      study: "Навчання з нами",
      massages: "Масажі та процедури",
      prices: "Ціни",
      followUs: "Стежте за нами",
      menu: "Відкрити або закрити меню",
      closeMenu: "Закрити меню",
      professional: "Професійний кабінет",
      language: "Мова",
    },
  },
  ru: {
    nav: {
      salonServices: "Услуги салона",
      study: "Обучение с нами",
      massages: "Массажи и процедуры",
      prices: "Цены",
      followUs: "Подписывайтесь на нас",
      menu: "Открыть или закрыть меню",
      closeMenu: "Закрыть меню",
      professional: "Кабинет специалиста",
      language: "Язык",
    },
  },
};

const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === "undefined") return "en";

  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (SUPPORTED_LANGUAGES.includes(saved)) return saved;
  } catch {
    // Storage can be unavailable in private or restricted browsing modes.
  }

  const browserLanguage = window.navigator.language?.slice(0, 2).toLowerCase();
  return SUPPORTED_LANGUAGES.includes(browserLanguage) ? browserLanguage : "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Language still works for the current session if storage is unavailable.
    }

    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        if (SUPPORTED_LANGUAGES.includes(nextLanguage)) {
          setLanguage(nextLanguage);
        }
      },
      t: (key) => {
        const parts = key.split(".");
        let value = messages[language];

        for (const part of parts) value = value?.[part];

        return typeof value === "string" ? value : key;
      },
      supportedLanguages: SUPPORTED_LANGUAGES,
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
