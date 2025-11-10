import React, { useEffect, useState, useRef } from "react";
import api from "../api/axiosInstance";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import { FiTag } from "react-icons/fi";

const EditContentForm = ({ id, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagList, setShowTagList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");

  const language = useLanguage();
  const { t } = useTranslation();
  const tagDropdownRef = useRef(null);

  // Fetch content
  const fetchContent = async () => {
    try {
      const res = await api.get(`/category-content/get/${id}`, {
        headers: { "X-Locale": language },
      });
      const data = res.data.data.contentData;
      const tagList = res.data.data.contentTags || [];
      setTitle(data.title);
      setNotes(data.notes);
      setSelectedTags(tagList.map((t) => t.tag));
      if (data.media_file && typeof data.media_file === "string") {
        setFilePreview(data.media_file);
      }
    } catch (err) {
      console.error("Error fetching content:", err);
    }
  };

  // Fetch tags
  const fetchTags = async () => {
    try {
      const res = await api.get("/tags", {
        headers: { "X-Locale": language },
      });
      setTags(res.data.data || []);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  useEffect(() => {
    fetchContent();
    fetchTags();
  }, [id, language]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(e.target)) {
        setShowTagList(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // File selection with validation
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
      setFileError(t("edit-content.file.error-type"));
      setFile(null);
      return;
    }

    if (selectedFile.size > maxSize) {
      setFileError(t("edit-content.file.error-size"));
      setFile(null);
      return;
    }

    setFile(selectedFile);
    if (selectedFile.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFilePreview("");
    }
  };

  // Add tag (custom or predefined)
  const addTag = (tagName) => {
    const trimmed = tagName.trim();
    if (!trimmed || selectedTags.includes(trimmed)) return;
    setSelectedTags((prev) => [...prev, trimmed]);
    setTagInput("");
  };

  const removeTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // Update content
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("notes", notes);
      selectedTags.forEach((tag, i) => formData.append(`tags[${i}]`, tag));
      if (file) formData.append("media_file", file);

      await api.post(`/category-content/update/${id}`, formData, {
        headers: { "X-Locale": language },
      });

      toast.success(t("edit-content.alerts.success"));
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating content:", err);
      toast.error(t("edit-content.alerts.failed"));
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
    <>
      <Toaster position="top-right" />
      <form onSubmit={handleUpdate} className="space-y-6 relative">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t("edit-content.labels.media-file")}</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-all duration-200">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.pdf,image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-edit"
              required
            />
            <label htmlFor="file-upload-edit" className="cursor-pointer block">
              <div className="text-3xl mb-2">📁</div>
              <p className="text-gray-600 font-medium mb-1">
                {file ? t("edit-content.file.change") : t("edit-content.file.choose")}
              </p>
              <p className="text-xs text-gray-500">{t("edit-content.file.types")}</p>
            </label>
          </div>

          {(filePreview || file) && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                {filePreview ? (
                  <>
                    <img src={filePreview} alt="Preview" className="w-10 h-10 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {file ? file.name : t("edit-content.file.current-image")}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">{getFileIcon(file)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                    </div>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setFilePreview("");
                  }}
                  className="text-red-500 hover:text-red-700 text-lg font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {fileError && <p className="mt-2 text-sm text-red-600 flex items-center">⚠️ {fileError}</p>}
        </div>

        {/* Title & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t("edit-content.labels.title")}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder={t("edit-content.placeholders.title")}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t("edit-content.labels.notes")}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="1"
              required
              placeholder={t("edit-content.placeholders.notes")}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Tags Input */}
        <div className="relative" ref={tagDropdownRef}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t("edit-content.labels.tags-label")}</label>
          <div className="flex flex-wrap items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            {selectedTags.map((tag) => (
              <div key={tag} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-lg mr-2 mb-2">
                <span className="text-sm">{tag}</span>
                <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-blue-500 hover:text-red-600">×</button>
              </div>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={t("edit-content.placeholders.tag-placeholder")}
              className="flex-1 outline-none text-sm py-1 px-1 min-w-[100px]"
            />
            <button type="button" onClick={() => setShowTagList(!showTagList)} className="text-gray-500 hover:text-blue-600 p-2">
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
                      selectedTags.includes(t.tag) ? "bg-blue-50 text-blue-600" : "text-gray-700"
                    }`}
                  >
                    #{t.tag}
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm">{t("edit-content.tags.no-tags")}</p>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
          >
            {t("edit-content.buttons.cancel")}
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-xl text-white font-medium ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? t("edit-content.buttons.updating") : t("edit-content.buttons.update")}
          </button>
        </div>
      </form>
    </>
  );
};

export default EditContentForm;
