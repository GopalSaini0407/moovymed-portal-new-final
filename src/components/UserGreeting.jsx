import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axiosInstance";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";

const UserGreeting = () => {
  const [user, setUser] = useState(null);
  const language = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile", {
          headers: {"X-Locale": language,
          },
        });
        setUser(response.data.data);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };
    fetchProfile();
  }, [language]);

  if (!user) return null;

  return (
    <div className="text-center mb-8">
    <h2 className="text-2xl font-semibold text-white">
      {t("welcome.greeting", { name: user.name })}
    </h2>
    <p className="text-gray-100 mt-2">{t("welcome.message")}</p>
  </div>
  );
};

export default UserGreeting;
