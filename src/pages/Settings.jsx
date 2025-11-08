import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DashboardNavbar from "../components/navbar/DashboardNavbar";
import MainLayout from "../layouts/MainLayout";

export default function Settings() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cards = [
    {
      title: t("settings.tag-settings-title"),
      description: t("settings.tag-settings-description"),
      path: "/settings/tags",
    },
    {
      title: t("settings.user-profile-title"),
      description: t("settings.user-profile-description"),
      path: "/settings/profile",
    },
  ];

  return (
    <MainLayout>
      <div
        className="max-w-7xl mx-auto p-6 rounded-2xl"
        style={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-lg font-medium mb-4"
        >
          <IoArrowBack size={22} />
          {t("settings.back")}
        </button>

        {/* Page Title */}
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
          {t("settings.title")}
        </h2>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link to={card.path} key={card.title}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 h-40 flex flex-col items-center justify-center text-center p-4">
                <h5 className="text-xl font-medium mb-2 text-gray-800">
                  {card.title}
                </h5>
                <p className="text-gray-500 text-sm">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
