import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";

const Categories = ({ filteredCategories, searchActive }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const language = useLanguage();
  const { t } = useTranslation();

  // 📦 Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await api.post(
        "categories",
        {},
        {
          headers: { "X-Locale": language },
        }
      );

      if (response.data && response.data.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Fetch again whenever language changes
  useEffect(() => {
    fetchCategories();
  }, [language]);

  const handleCategoryClick = (id) => {
    navigate(`/category/${id}`);
  };

  const handleMouseEnter = (category, event) => {
    setHoveredCategory(category);

    // Calculate tooltip position
    const rect = event.currentTarget.getBoundingClientRect();
    const tooltipWidth = 250; // approximate tooltip width in px
    const padding = 10;
    const viewportWidth = window.innerWidth;

    let x = rect.left + rect.width / 2;
    let y = rect.top - 10;

    // ✅ Prevent tooltip overflow on the left
    if (x - tooltipWidth / 2 < padding) {
      x = tooltipWidth / 2 + padding;
    }

    // ✅ Prevent tooltip overflow on the right
    if (x + tooltipWidth / 2 > viewportWidth - padding) {
      x = viewportWidth - tooltipWidth / 2 - padding;
    }

    setTooltipPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  // Use filtered categories if provided, otherwise use all categories
  const displayCategories =
    filteredCategories && searchActive ? filteredCategories : categories;

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        {t("categories.loading")}
      </div>
    );
  }

  if (searchActive && displayCategories.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">😕</div>
          <p>{t("categories.no-categories")}</p>
          <p className="text-sm mt-2">{t("categories.try-different")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 relative"
    
    style={{
      backdropFilter: "blur(20px)",
      backgroundColor: "rgba(255, 255, 255, 0.75)",
    }}>
      {!searchActive && (
        <div className="text-center mb-6">
          <span className="text-sm font-medium text-gray-700">
            {t("categories.title")}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {displayCategories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category.id)}
            onMouseEnter={(e) => handleMouseEnter(category, e)}
            onMouseLeave={handleMouseLeave}
            className="bg-gray-50 hover:bg-blue-50 rounded-xl p-4 text-center cursor-pointer transition-all duration-300 border border-transparent hover:border-blue-200 hover:shadow-lg group relative"
          >
            <div className="flex justify-center mb-2">
              <img
                src={`https://app.moovymed.de/${category.icon}`}
                alt={category.category_name}
                className="w-25 h-25 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="text-gray-700 font-medium text-sm mb-1 group-hover:text-blue-700 transition-colors">
              {category.category_name}
            </div>
            {category.content_count !== null && (
              <div className="text-blue-600 text-xs font-semibold">
                {category.content_count} {t("categories.single-item")}(s)
              </div>
            )}

            {/* Info icon */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                i
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✨ Beautiful Tooltip */}
      {hoveredCategory && (
        <div
          className="tool-tip-box fixed z-50 transform -translate-x-1/2 -translate-y-full pointer-events-none transition-opacity duration-200"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            width:"250px"
          }}
        >
          {/* Tooltip Arrow */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-4 h-4 rotate-45 bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400"></div>

          {/* Tooltip Content */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-2xl border border-blue-400 p-4 max-w-xs mx-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <img
                  src={`https://app.moovymed.de/${hoveredCategory.icon}`}
                  alt={hoveredCategory.category_name}
                  className="w-8 h-8"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm mb-2">
                  {hoveredCategory.category_name}
                </h3>
                <p className="text-blue-100 text-xs leading-relaxed">
                  {hoveredCategory.description}
                </p>
                {hoveredCategory.content_count !== null && (
                  <div className="mt-2 pt-2 border-t border-blue-400">
                    <span className="text-blue-200 text-xs font-semibold">
                      {hoveredCategory.content_count}{" "}
                      {t("categories.multiple-items")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
