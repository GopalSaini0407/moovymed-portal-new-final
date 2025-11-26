import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";
import Model from "../components/model/Model"; // 👈 Reusable modal

export default function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const { t } = useTranslation();
  const language = useLanguage();
  const navigate = useNavigate();

  // 🔹 Fetch categories
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await api.post("/categories", {
        headers: {
          "X-Locale": language,
        },
      });
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // 🔹 Search function
  const searchContent = async (query, categoryId = "") => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const payload = { search_term: query, page: 1 };
      if (categoryId) payload.category_id = categoryId;

      const response = await api.post("/category-contents", payload, {
        headers: { "X-Locale": language },
      });

      setResults(response.data.data.data || []);
    } catch (error) {
      console.error("Error searching content:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Debounce search
  useEffect(() => {
    if (!isOpen) return;
    const delay = setTimeout(() => {
      searchContent(searchQuery, selectedCategory);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchQuery, selectedCategory, isOpen]);

  // 🔹 Reset when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setResults([]);
      setSelectedCategory("");
      fetchCategories();
    }
  }, [isOpen, language]);

  const handleResultClick = (item) => {
    // navigate(`/content/${item.id}`);
    // item.category_id,item.id
    navigate(`/category/${item.category_id}/content/${item.id}`);

    onClose();
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.id}`);
    onClose();
  };

  const getFileIcon = (file) => {
    if (!file) return "📎";
    const f = file.toLowerCase();
    if (f.endsWith(".pdf")) return "📄";
    if (f.match(/\.(png|jpg|jpeg|gif)$/)) return "🖼️";
    if (f.endsWith(".mp4")) return "🎥";
    return "📎";
  };

  const parseTags = (tagsString) => {
    try {
      if (!tagsString) return [];
      const parsed = JSON.parse(tagsString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.category_name : t("search-modal.unknown-category");
  };

  return (
    <Model
      isOpen={isOpen}
      onClose={onClose}
      title={t("search-modal.title")}
      size="xl"
    >
      <div className="max-h-[75vh] overflow-y-auto px-1">
        {/* 🔍 Search Input */}
        <div className="space-y-4 mb-6">
           {/* Category Filter */}
           <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("search-modal.filter-label")}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-200 text-md rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={categoriesLoading}
            >
              {/* <option value="">{t("search-modal.filter-placeholder")}</option> */}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name} ({cat.content_count})
                </option>
              ))}
            </select>
            {categoriesLoading && (
              <p className="text-xs text-gray-500 mt-1">
                {t("search-modal.loading-categories")}
              </p>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search-modal.placeholder")}
              className="w-full border mt-3 border-gray-200 rounded-xl px-4 py-3 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

         
        </div>

        {/* 🔹 Search Results */}
        <div>
          {searchQuery.trim() === "" ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-3">{t("search-modal.empty-prompt-icon")}</div>
              <p className="text-lg mb-1">{t("search-modal.empty-prompt-title")}</p>
              <p className="text-sm">{t("search-modal.empty-prompt-description")}</p>
            </div>
          ) : loading ? (
            <div className="text-center text-gray-600 py-8">
              <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p>
                {selectedCategory
                  ? t("search-modal.searching", {
                      category: getCategoryName(parseInt(selectedCategory)),
                    })
                  : t("search-modal.searching-all")}
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              {results.map((item) => {
                const tags = parseTags(item.tags);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleResultClick(item)}
                    className="border border-gray-200 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{getFileIcon(item.media_file)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {item.title}
                          </h3>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {getCategoryName(item.category_id)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {item.notes}
                        </p>
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                              >
                                #{typeof tag === "object" ? tag.tag : tag}
                              </span>
                            ))}
                            {tags.length > 3 && (
                              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                                +{tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                        {item.media_file && (
                          <p className="text-xs text-gray-500 truncate">
                            📁 {item.media_file.split("/").pop()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-3">{t("search-modal.no-results-icon")}</div>
              <p className="text-lg mb-1">
                {t("search-modal.no-results-title", { query: searchQuery })}
              </p>
              <p className="text-sm">{t("search-modal.no-results-description")}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {t("search-modal.instructions")}
          </p>
        </div>
      </div>
    </Model>
  );
}
