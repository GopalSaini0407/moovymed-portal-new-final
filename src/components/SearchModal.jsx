import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";

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

  // Fetch categories
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await api.post(
        "/categories",
        {
          headers: {
            "X-Locale": language,
          },
        }
      );
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Search function using your API
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

      const searchResults = response.data.data.data || [];
      setResults(searchResults);
    } catch (error) {
      console.error("Error searching content:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce effect
  useEffect(() => {
    if (!isOpen) return;
    const delayDebounce = setTimeout(() => {
      searchContent(searchQuery, selectedCategory);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedCategory, isOpen]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setResults([]);
      setSelectedCategory("");
      fetchCategories();
    }
  }, [isOpen, language]);

  const handleResultClick = (item) => {
    navigate(`/content/${item.id}`);
    onClose();
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.id}`);
    onClose();
  };

  const getFileIcon = (mediaFile) => {
    if (!mediaFile) return "📎";
    if (mediaFile.toLowerCase().endsWith(".pdf")) return "📄";
    if (
      mediaFile.toLowerCase().endsWith(".png") ||
      mediaFile.toLowerCase().endsWith(".jpg") ||
      mediaFile.toLowerCase().endsWith(".jpeg") ||
      mediaFile.toLowerCase().endsWith(".gif")
    )
      return "🖼️";
    if (mediaFile.toLowerCase().endsWith(".mp4")) return "🎥";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-light z-10"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          {t("search-modal.title")}
        </h2>

        {/* Search Input and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search-modal.placeholder")}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("search-modal.filter-label")}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={categoriesLoading}
            >
              <option value="">{t("search-modal.filter-placeholder")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name} ({category.content_count})
                </option>
              ))}
            </select>
            {categoriesLoading && (
              <p className="text-xs text-gray-500 mt-1">
                {t("search-modal.loading-categories")}
              </p>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="mt-4">
          {searchQuery.trim() === "" ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-3">{t("search-modal.empty-prompt-icon")}</div>
              <p className="text-lg mb-2">{t("search-modal.empty-prompt-title")}</p>
              <p className="text-sm">{t("search-modal.empty-prompt-description")}</p>
            </div>
          ) : loading ? (
            <div className="text-center text-gray-600 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p>
                {selectedCategory
                  ? t("search-modal.searching", {
                      category: getCategoryName(parseInt(selectedCategory)),
                    })
                  : t("search-modal.searching-all")}
              </p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-3">
                {selectedCategory
                  ? t("search-modal.found-results-in-category", {
                      count: results.length,
                      query: searchQuery,
                      category: getCategoryName(parseInt(selectedCategory)),
                    })
                  : t("search-modal.found-results", {
                      count: results.length,
                      query: searchQuery,
                    })}
              </p>

              {/* Content Results */}
              <div className="space-y-3">
                {results.map((item) => {
                  const tags = parseTags(item.tags);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleResultClick(item)}
                      className="border border-gray-200 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 text-2xl">
                          {getFileIcon(item.media_file)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
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

                          {/* Tags */}
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
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
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-3">{t("search-modal.no-results-icon")}</div>
              <p className="text-lg mb-2">
                {t("search-modal.no-results-title", { query: searchQuery })}
              </p>
              <p className="text-sm">{t("search-modal.no-results-description")}</p>

              {categories.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    {t("search-modal.browse-categories-title")}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.slice(0, 6).map((category) => (
                      <div
                        key={category.id}
                        onClick={() => handleCategoryClick(category)}
                        className="border border-gray-200 rounded-lg p-3 text-center hover:bg-green-50 hover:border-green-200 cursor-pointer transition-all"
                      >
                        <div className="text-lg mb-1">{getFileIcon(category.icon)}</div>
                        <p className="text-xs font-medium text-gray-800">
                          {category.category_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t("search-modal.browse-category-items", {
                            count: category.content_count,
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Categories */}
        {searchQuery.trim() === "" && categories.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              {t("search-modal.quick-access-title")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="border border-gray-200 rounded-xl p-4 text-center hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all duration-200"
                >
                  <div className="text-2xl mb-2">
                    <img
                      src={`https://app.moovymed.de/${category.icon}`}
                      alt={category.category_name}
                      className="w-8 h-8 mx-auto object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <span style={{ display: "none" }}>📁</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    {category.category_name}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {category.description}
                  </p>
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {t("search-modal.quick-access-item-count", {
                      count: category.content_count,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {t("search-modal.instructions")}
          </p>
        </div>
      </div>
    </div>
  );
}
