// src/components/LanguageSwitcher.jsx
import React, { useState, useEffect } from "react";
import { GrLanguage } from "react-icons/gr";
import i18n from "../../i18n";

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("language", selectedLang);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <div className="flex items-center gap-2">
      <GrLanguage className="text-blue-400 text-xl" />
      <select
        value={language}
        onChange={handleLanguageChange}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="en">English</option>
        <option value="de">German</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
