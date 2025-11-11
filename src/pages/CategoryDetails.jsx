import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import AddContentForm from "../components/AddContentForm";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";
import Model from "../components/model/Model";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Footer from "../components/Footer";

const CategoryDetails = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams();
  const categoryId = id;
  const navigate = useNavigate();
  const language = useLanguage();
  const { t } = useTranslation();

  // Fetch category info
  const fetchCategoryDetails = async () => {
    try {
      const response = await api.post(
        "/categories",
        {
          headers: { "X-Locale": language },
        },
      );

      const allCategories = response.data.data || response.data;
      const found = allCategories.find((c) => c.id === parseInt(categoryId));
      if (found) setCategory(found);
    } catch (error) {
      console.error("Error fetching category details:", error);
      // toast.error(t("Error fetching category details:", error));

    }
  };

  // Fetch category contents
  const fetchCategoryContents = async (page = 1) => {
    try {
      const response = await api.post(
        "/category-contents",
        { category_id: categoryId, page },
        {
          headers: {"X-Locale":language },
        }
      );

      const result = response.data.data;
      setContents(result.data || []);
      setPagination({
        current_page: result.current_page,
        last_page: result.last_page,
      });
    } catch (error) {
      console.error("Error fetching category contents:", error);
      // toast.error(t("Error fetching category details:", error));

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
    fetchCategoryContents();
  }, [language]);

  const handlePageChange = (page) => {
    setLoading(true);
    fetchCategoryContents(page);
  };

  // Check if file is PDF
  const isPDF = (fileUrl) => {
    return fileUrl?.toLowerCase().endsWith('.pdf') || fileUrl?.includes('.pdf');
  };

  // Check if file is image
  const isImage = (fileUrl) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => 
      fileUrl?.toLowerCase().endsWith(ext) || 
      fileUrl?.includes(ext.replace('.', ''))
    );
  };

  // Get file icon based on type
  const getFileIcon = (fileUrl) => {
    if (isPDF(fileUrl)) return "📄";
    if (isImage(fileUrl)) return "🖼️";
    return "📎";
  };

  // Fix tags parsing - handle both string and object formats
  const parseTags = (tags) => {
    if (!tags) return [];
    try {
      if (Array.isArray(tags)) return tags;
      if (typeof tags === 'string') {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
          return parsed.map(tag => tag.tag || tag.name || '');
        }
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Error parsing tags:', error);
      // toast.error(t("Error parsing tags:", error));

      return [];
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-10 text-gray-500">
          {t("category-details.loading")}
        </div>
      </MainLayout>
    );
  }

  const handleContentClick = (cat_id,id) => {
    navigate(`/category/${cat_id}/content/${id}`);
  };

  return (
    <MainLayout>
      <div 
        className="rounded-2xl shadow-sm p-6"
        style={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
        }}
      >
        {/* Top Header Section */}
        {category && (
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:underline text-sm mb-3 inline-block"
            >
              {t("category-details.top-header.back")}
            </button>

            <div className="flex items-center justify-center flex-col gap-4">
              <div>
                <img
                  src={`https://app.moovymed.de/${category.icon}`}
                  alt={category.category_name}
                  className="w-35 h-35"
                />
              </div>
             
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  {category.category_name}
                </h1>
                <div className="text-blue-600 text-xs font-semibold">
                  {t("category-details.top-header.items-count", { count: category.content_count })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header with Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            {t("category-details.section-titles.category-contents")}
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white md:px-4 md:py-2 text-sm md:text-md px-2 py-1 rounded-lg hover:bg-blue-600 transition"
          >
            {t("category-details.buttons.add-content")}
          </button>
        </div>

        {/* Content Section */}
        {contents.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {contents.map((item) => {
                const parsedTags = parseTags(item.tags);
                const isPdfFile = isPDF(item.media_file);
                const isImageFile = isImage(item.media_file);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border border-gray-100"
                    onClick={() => handleContentClick(item.category_id,item.id)}
                  >
                    {/* File Display */}
                    <div className="p-4 flex flex-col items-center justify-center h-32">
                      {isImageFile && item.media_file ? (
                        <img
                          src={item.media_file}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.parentNode.querySelector('.fallback-icon');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      
                      <div 
                        className={`fallback-icon flex flex-col items-center justify-center w-full h-full rounded-lg ${
                          isPdfFile ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-50 border-2 border-gray-200'
                        } ${isImageFile && item.media_file ? 'hidden' : 'flex'}`}
                      >
                        <div className="text-3xl mb-2">
                          {getFileIcon(item.media_file)}
                        </div>
                        <div className={`text-xs font-medium ${
                          isPdfFile ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {isPdfFile ? t("category-details.file-types.pdf") : t("category-details.file-types.default")}
                        </div>
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="p-3 border-t border-gray-100">
                      <h3 className="font-medium text-gray-800 text-sm text-center truncate">
                        {item.title}
                      </h3>
                      
                      {parsedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2 justify-center">
                          {parsedTags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
                            >
                              {typeof tag === 'object' ? (tag.tag || tag.name || '') : tag}
                            </span>
                          ))}
                          {parsedTags.length > 2 && (
                            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                              +{parsedTags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            {t("category-details.no-records")}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 space-x-3">
          <button
            disabled={pagination.current_page <= 1}
            onClick={() => handlePageChange(pagination.current_page - 1)}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              pagination.current_page <= 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {t("category-details.pagination.previous")}
          </button>

          <span className="text-sm text-gray-600">
            {t("category-details.pagination.page-info", { current: pagination.current_page, last: pagination.last_page })}
          </span>

          <button
            disabled={pagination.current_page >= pagination.last_page}
            onClick={() => handlePageChange(pagination.current_page + 1)}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              pagination.current_page >= pagination.last_page
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {t("category-details.pagination.next")}
          </button>
        </div>
      </div>

      {/* Add Content Modal */}
   
      <Model
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={t("add-content.title")}
      size="lg" // sm | md | lg | xl | full
      >
      <AddContentForm
          categoryId={categoryId}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchCategoryContents}
        />

      </Model>
      <Footer/>
    </MainLayout>
  );
};

export default CategoryDetails;
