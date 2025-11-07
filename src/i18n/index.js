import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      // Local translation files (public folder)
      loadPath: "/locales/{{lng}}/translation.json",
    },
    supportedLngs: ["en", "de"],
    fallbackLng: "en",
    lng: localStorage.getItem("language") || "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
