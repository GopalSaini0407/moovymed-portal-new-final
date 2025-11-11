import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axiosInstance";
import { useLanguage } from "../../hooks/useLanguage";
import { useTranslation } from "react-i18next";
import { FiTag } from "react-icons/fi";

const DocumentUpload = ({ onClose,onSuccess}) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagList, setShowTagList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");

  const tagDropdownRef = useRef(null);
  const { language } = useLanguage();
  const { t } = useTranslation();

  // ✅ Toast Notification
  const showToast = (message, type = "success") => {
    const existingToasts = document.querySelectorAll(".custom-toast");
    existingToasts.forEach((toast) => toast.remove());

    const toast = document.createElement("div");
    toast.className = `custom-toast fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-medium transform transition-all duration-300 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  };

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.post("/categories", {}, { headers: { "X-Locale": language } });
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast(t("document-upload.toast-category-error"), "error");
    }
  };

  // ✅ Fetch tags
  const fetchTags = async () => {
    try {
      const res = await api.get("/tags", { headers: { "X-Locale": language } });
      setTags(res.data.data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, [language]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(e.target)) {
        setShowTagList(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ File Change with Validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf"];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(selectedFile.type)) {
      setFileError(t("document-upload.file-error-type"));
      setFile(null);
      return;
    }

    if (selectedFile.size > maxSize) {
      setFileError(t("document-upload.file-error-size"));
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // ✅ Add tag (custom or existing)
  const addTag = async (tagName) => {
    const trimmed = tagName.trim();
    if (!trimmed) return;

    // check duplicate
    if (selectedTags.includes(trimmed)) return;

    // check if tag already exists in DB
    const existing = tags.find((t) => t.tag.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      setSelectedTags((prev) => [...prev, existing.tag]);
      setTagInput("");
      return;
    }

    // create new tag via API
    try {
      await api.post("/tag/create", { tag: trimmed }, { headers: { "X-Locale": language } });
      setSelectedTags((prev) => [...prev, trimmed]);
      fetchTags(); // refresh tag list
      showToast(t("document-upload.toast-tag-success"));
    } catch (error) {
      console.error("Error creating tag:", error);
      showToast(t("document-upload.toast-tag-error"), "error");
    }
    setTagInput("");
  };

  // ✅ Remove tag
  const removeTag = (tagName) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagName));
  };

  // ✅ Handle Enter / Comma for adding custom tag
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategoryId) {
      showToast(t("document-upload.toast-no-category"), "error");
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("notes", notes);
      formData.append("category_id", selectedCategoryId);
      if (file) formData.append("media_file", file);

      selectedTags.forEach((tag, i) => formData.append(`tags[${i}]`, tag));

      const res = await api.post("/category-content/create", formData, {
        headers: { "X-Locale": language },
      });

      if (res.status === 200 || res.status === 201) {
        showToast(t("document-upload.toast-success"));
        setTitle("");
        setNotes("");
        setFile(null);
        setSelectedCategoryId("");
        setSelectedTags([]);
      
        // ✅ Call success handler first
        if (onSuccess) onSuccess();
      
        // ✅ Then close modal
        setTimeout(() => onClose?.(), 1500);
      }
       else throw new Error("Failed to add content");
    } catch (error) {
      console.error("Error adding content:", error);
      showToast(t("document-upload.toast-error"), "error");
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (file) => {
    if (file?.type?.startsWith("image/")) return "🖼️";
    if (file?.type === "application/pdf") return "📄";
    return "📎";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">
      {/* File Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t("document-upload.media-file-label")}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-all duration-200">
          <input
            type="file"
            required
            accept=".jpg,.jpeg,.png,.gif,.pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            <div className="text-4xl mb-3">📁</div>
            <p className="text-gray-600 font-medium mb-1 text-lg">
              {file ? t("document-upload.file-change") : t("document-upload.file-choose")}
            </p>
            <p className="text-sm text-gray-500">{t("document-upload.file-types")}</p>
          </label>
        </div>

        {file && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center">
            <span className="text-2xl mr-3">{getFileIcon(file)}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-red-500 hover:text-red-700 text-lg font-bold"
            >
              ×
            </button>
          </div>
        )}

        {fileError && (
          <p className="mt-2 text-sm text-red-600 flex items-center">⚠️ {fileError}</p>
        )}
      </div>

      {/* Title + Notes + Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t("document-upload.title-label")}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("document-upload.title-placeholder")}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t("document-upload.notes-label")}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="1"
            required
            placeholder={t("document-upload.notes-placeholder")}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t("document-upload.select-category-label")}
        </label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t("document-upload.select-category-placeholder")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.category_name}
            </option>
          ))}
        </select>
      </div>

      {/* 🔥 Smart Tag Input */}
      <div className="relative" ref={tagDropdownRef}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t("document-upload.tags-label")}
        </label>

        <div className="flex flex-wrap items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          {selectedTags.map((tag) => (
            <div
              key={tag}
              className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-lg mr-2 mb-2"
            >
              <span className="text-sm">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-blue-500 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}

          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={t("document-upload.tag-placeholder")}
            className="flex-1 outline-none text-sm py-1 px-1 min-w-[100px]"
          />

          <button
            type="button"
            onClick={() => setShowTagList(!showTagList)}
            className="text-gray-500 hover:text-blue-600 p-2"
          >
            <FiTag size={18} />
          </button>
        </div>

        {showTagList && (
          <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-xl p-2 z-10 max-h-48 overflow-y-auto">
            {tags.length > 0 ? (
              tags.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => addTag(t.tag)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-blue-100 ${
                    selectedTags.includes(t.tag)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  #{t.tag}
                </button>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm">
                {t("document-upload.no-tags")}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
        >
          {t("document-upload.cancel-button")}
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? t("document-upload.saving") : t("document-upload.save-button")}
        </button>
      </div>
    </form>
  );
};

export default DocumentUpload;
