import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axiosInstance";
import { useLanguage } from "../hooks/useLanguage";

const EditContentForm = ({ id, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null); // single file
  const [filePreview, setFilePreview] = useState(""); // for existing image preview
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");

  const language = useLanguage();

  // 🔹 Fetch content details
  const fetchContent = async () => {
    try {
      const res = await api.get(
        `/category-content/get/${id}`,
        { headers: {"X-Locale": language,
        } }
      );

      const data = res.data.data.contentData;
      const tagList = res.data.data.contentTags || [];

      setTitle(data.title);
      setNotes(data.notes);
      setSelectedTags(tagList.map((t) => t.id.toString()));

      if (data.media_file && typeof data.media_file === "string") {
        setFilePreview(data.media_file); // existing file preview (image)
      }
    } catch (err) {
      console.error("Error fetching content:", err);
    }
  };

  // 🔹 Fetch tags
  const fetchTags = async () => {
    try {
      const res = await api.get("/tags", {
        headers: { "X-Locale": language, },
      });
      setTags(res.data.data || []);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  useEffect(() => {
    fetchContent();
    fetchTags();
  }, [id,language]);

  // 🔹 Handle file selection with validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(selectedFile.type)) {
      setFileError("Only JPEG, PNG, GIF images and PDF files are allowed");
      setFile(null);
      return;
    }

    if (selectedFile.size > maxSize) {
      setFileError("File size must be less than 10MB");
      setFile(null);
      return;
    }

    setFile(selectedFile);

    // Show preview if image
    if (selectedFile.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFilePreview(""); // clear preview if not image
    }
  };

  // 🔹 Add new tag
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      await api.post(
        "/tag/create",
        { tag: newTag },
        {
          headers: {
            "X-Locale": language
          },
        }
      );
      setNewTag("");
      fetchTags();
      alert("Tag added successfully!");
    } catch (err) {
      console.error("Error adding tag:", err);
      alert("Failed to add tag");
    }
  };

  // 🔹 Update content
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("notes", notes);

      // Tags
      const selectedTagNames = tags
        .filter((t) => selectedTags.includes(t.id.toString()))
        .map((t) => t.tag);
      selectedTagNames.forEach((tagName, i) =>
        formData.append(`tags[${i}]`, tagName)
      );

      // Media file
      if (file) {
        formData.append("media_file", file);
      }

      await api.post(
        `/category-content/update/${id}`,
        formData,
        {
          headers: {
            "X-Locale": language
          },
        }
      );

      alert("✅ Content updated successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating content:", err);
      alert("❌ Update failed!");
    } finally {
      setLoading(false);
    }
  };

  // Get file icon based on type
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return "🖼️";
    } else if (file.type === 'application/pdf') {
      return "📄";
    }
    return "📎";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-xl relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Edit Content</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* First Row - Title and Notes side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter content title"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes *
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
                rows="1"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Enter your notes here..."
              />
            </div>
          </div>

          {/* Second Row - File Upload and Tags side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Media File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-all duration-200">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload-edit"
                />
                <label
                  htmlFor="file-upload-edit"
                  className="cursor-pointer block"
                >
                  <div className="text-3xl mb-2">📁</div>
                  <p className="text-gray-600 font-medium mb-1">
                    {file ? "Change File" : "Choose a file"}
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, GIF, PDF (Max 10MB)
                  </p>
                </label>
              </div>

              {/* File Preview */}
              {(filePreview || file) && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    {filePreview ? (
                      <>
                        <img 
                          src={filePreview} 
                          alt="Preview" 
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {file ? file.name : "Current Image"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Existing file"}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">{getFileIcon(file)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
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

              {/* File Error */}
              {fileError && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {fileError}
                </p>
              )}
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Tags
              </label>
              <select
                multiple
                value={selectedTags}
                onChange={(e) =>
                  setSelectedTags(
                    Array.from(e.target.selectedOptions, (opt) => opt.value)
                  )
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-32"
              >
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id} className="py-2">
                    {tag.tag}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl/Cmd to select multiple tags
              </p>
            </div>
          </div>

          {/* Third Row - Add New Tag full width */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add New Tag
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter new tag name"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-green-500 text-white px-5 py-3 rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              Cancel
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
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Content"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContentForm;