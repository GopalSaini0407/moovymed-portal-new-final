import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axiosInstance";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const AddContentForm = ({ categoryId, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");

  const language = useLanguage();
  const { t } = useTranslation();

  // Fetch existing tags
  const fetchTags = async () => {
    try {
      const res = await api.get("/tags", {
        headers: {
          "X-Locale": language,
        },
      });
      setTags(res.data.data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [language]);

  // Handle file selection with validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(selectedFile.type)) {
      setFileError(t("add-content.file.error-type"));
      setFile(null);
      return;
    }

    if (selectedFile.size > maxSize) {
      setFileError(t("add-content.file.error-size"));
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // Add new tag
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      await api.post(
        "/tag/create",
        { tag: newTag },
        {
          headers: {
            "X-Locale": language,
          },
        }
      );
      setNewTag("");
      fetchTags();
      alert(t("add-content.tags.add-success"));
    } catch (error) {
      console.error("Error creating tag:", error);
      alert(t("add-content.tags.add-failed"));
    }
  };

  // Submit content form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("notes", notes);
      formData.append("category_id", categoryId);

      if (file) {
        formData.append("media_file", file);
      }

      const selectedTagNames = tags
        .filter((t) => selectedTags.includes(t.id.toString()))
        .map((t) => t.tag);

      selectedTagNames.forEach((tagName, i) =>
        formData.append(`tags[${i}]`, tagName)
      );

      await api.post("/category-content/create", formData, {
        headers: {
          "X-Locale": language,
        },
      });
      toast.success(t("add-content.alerts.success"));

      // alert(t("add-content.alerts.success"));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding content:", error);
      alert(t("add-content.alerts.failed"));
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
  
    <form onSubmit={handleSubmit} className="space-y-6">
    {/* Second Row - File Upload and Tags */}
    <div className="grid grid-cols-1 gap-6">
    {/* File Upload */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {t("add-content.labels.media-file")}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-all duration-200">
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.pdf,image/*,application/pdf"
          onChange={handleFileChange}
          className="hidden"
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
          <span className="mr-1">⚠️</span>
          {fileError}
        </p>
      )}
    </div>

   
  </div>
  {/* First Row - Title and Notes */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Title */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {t("add-content.labels.title")}
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder={t("add-content.placeholders.title")}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
    </div>

    {/* Notes */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {t("add-content.labels.notes")}
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        required
        rows="1"
        placeholder={t("add-content.placeholders.notes")}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
      />
    </div>
  </div>



  {/* Third Row - Add New Tag */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Tag Selection */}
<div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {t("add-content.labels.select-tags")}
      </label>
      <select
        multiple
        value={selectedTags}
        onChange={(e) =>
          setSelectedTags(
            Array.from(e.target.selectedOptions, (opt) => opt.value)
          )
        }
        className="w-full border  border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.tag}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">
        {t("add-content.tags.select-hint")}
      </p>
    </div>
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {t("add-content.labels.add-new-tag")}
    </label>
    <div className="">
      <input
        type="text"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        placeholder={t("add-content.placeholders.new-tag")}
        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
      <button
        type="button"
        onClick={handleAddTag}
        className="bg-green-500 text-white mt-3  px-3 py-2 rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium"
      >
        {t("add-content.buttons.add-tag")}
      </button>
    </div>
  </div>
  </div>
 

  {/* Buttons */}
  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
    <button
      type="button"
      onClick={onClose}
      className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 font-medium"
    >
      {t("add-content.buttons.cancel")}
    </button>
    <button
      type="submit"
      disabled={loading}
      className={`px-6 py-3 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
      }`}
    >
      {loading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0
             c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {t("add-content.buttons.saving")}
        </span>
      ) : (
        t("add-content.buttons.save")
      )}
    </button>
  </div>
</form>
  );
};

export default AddContentForm;
