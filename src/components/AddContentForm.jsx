import React, { useEffect, useState, useRef } from "react";
import api from "../api/axiosInstance";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FiTag } from "react-icons/fi";

const AddContentForm = ({ categoryId, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]); // predefined tags from API
  const [selectedTags, setSelectedTags] = useState([]); // user selected/custom tags
  const [tagInput, setTagInput] = useState("");
  const [showTagList, setShowTagList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");

  const language = useLanguage();
  const { t } = useTranslation();
  const tagDropdownRef = useRef(null);

  // Fetch existing tags
  const fetchTags = async () => {
    try {
      const res = await api.get("/tags", {
        headers: { "X-Locale": language },
      });
      setTags(res.data.data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [language]);

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

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError("");

    if (!selectedFile) return setFile(null);

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(selectedFile.type)) {
      setFileError(t("add-content.file.error-type"));
      return setFile(null);
    }

    if (selectedFile.size > maxSize) {
      setFileError(t("add-content.file.error-size"));
      return setFile(null);
    }

    setFile(selectedFile);
  };

  // Add a tag (custom or predefined)
  const addTag = (tagName) => {
    const trimmed = tagName.trim();
    if (!trimmed) return;
    if (selectedTags.includes(trimmed)) return;
    setSelectedTags((prev) => [...prev, trimmed]);
    setTagInput("");
  };

  const removeTag = (tagName) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagName));
  };

  // Handle Enter or Comma input for custom tag
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submit clicked ✅");
    if (selectedTags.length === 0) {
      console.log("No tags selected ❌");
      toast.error("Please add at least one tag.");
      return;
    }
    // 🧩 Validation checks before API call
  if (!file) {
    toast.error(t("add-content.file.error-required") || "Please upload a file.");
    return;
  }

  if (!title.trim()) {
    toast.error(t("add-content.title.required") || "Please enter a title.");
    console.log("No title entered ❌");
    return;
  }

  if (!notes.trim()) {
    toast.error(t("add-content.notes.required") || "Please enter notes.");
    console.log("No notes entered ❌");
    return;
  }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("notes", notes);
      formData.append("category_id", categoryId);

      if (file) formData.append("media_file", file);

      selectedTags.forEach((tag, i) => formData.append(`tags[${i}]`, tag));

      await api.post("/category-content/create", formData, {
        headers: { "X-Locale": language },
      });

      toast.success(t("add-content.alerts.success"));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding content:", error);
      toast.error(t("add-content.alerts.failed"));
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) return "🖼️";
    if (file.type === "application/pdf") return "📄";
    return "📎";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">
      {/* File Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t("add-content.labels.media-file")}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-all duration-200">
          <input
            type="file"
            // required
            accept=".jpg,.jpeg,.png,.gif,.pdf,image/*,application/pdf"
            onChange={handleFileChange}
            // className="hidden"
            id="file-upload"
            
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            <div className="text-3xl mb-2">📁</div>
            <p className="text-gray-600 font-medium mb-1">
              {file
                ? t("add-content.file.change")
                : t("add-content.file.choose")}
            </p>
            <p className="text-xs text-gray-500">
              {t("add-content.file.types")}
            </p>
          </label>
        </div>

        {file && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getFileIcon(file)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {file.name}
                </p>
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
          </div>
        )}

        {fileError && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            ⚠️ {fileError}
          </p>
        )}
      </div>

      {/* Title + Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t("add-content.labels.title")}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            // required
            placeholder={t("add-content.placeholders.title")}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t("add-content.labels.notes")}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="1"
            // required
            placeholder={t("add-content.placeholders.notes")}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Smart Tag Input */}
      <div className="relative" ref={tagDropdownRef}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t("add-content.labels.tags-label")}
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
            placeholder={t("add-content.placeholders.tag-placeholder")}
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
                {t("add-content.tags.no-tags")}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          {t("add-content.buttons.cancel")}
        </button>

        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-xl text-white font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading
            ? t("add-content.buttons.saving")
            : t("add-content.buttons.save")}
        </button>
      </div>
    </form>
  );
};

export default AddContentForm;
