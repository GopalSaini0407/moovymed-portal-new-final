import { useState, useEffect } from "react";

/**
 * Custom hook to get reactive language changes
 * Works for the same tab and across tabs
 */
export const useLanguage = () => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  // Listen for changes in other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setLanguage(localStorage.getItem("language") || "en");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Listen for changes in the same tab
  useEffect(() => {
    const interval = setInterval(() => {
      const lang = localStorage.getItem("language") || "en";
      if (lang !== language) setLanguage(lang);
    }, 300);
    return () => clearInterval(interval);
  }, [language]);

  return language;
};
