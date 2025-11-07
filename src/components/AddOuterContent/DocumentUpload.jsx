import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance";
import { useLanguage } from "../../hooks/useLanguage";

const DocumentUpload = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null); // single file
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  
  const language = useLanguage();

  // Show toast notification
  const showToast = (message, type = "success") => {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.custom-toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `custom-toast fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-medium transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  // Fetch existing categories
  const fetchCategories = async () => {
    try {
      const res = await api.post(
        "/categories",
        {},
        {
          headers: {
            "X-Locale": language,
          },
        }
      );
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast("Failed to load categories", "error");
    }
  };

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
    fetchCategories();
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
      showToast("Tag added successfully!");
    } catch (error) {
      console.error("Error creating tag:", error);
      showToast("Failed to create tag", "error");
    }
  };

  // Submit content form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCategoryId) {
      showToast("Please select a category", "error");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("notes", notes);
      formData.append("category_id", selectedCategoryId);

      // ✅ Append single file
      if (file) {
        formData.append("media_file", file);
      }

      // ✅ Append tags
      const selectedTagNames = tags
        .filter((t) => selectedTags.includes(t.id.toString()))
        .map((t) => t.tag);

      selectedTagNames.forEach((tagName, i) =>
        formData.append(`tags[${i}]`, tagName)
      );

      const response = await api.post(
        "/category-content/create",
        formData,
        {
          headers: {
            "X-Locale": language,
          },
        }
      );

      // Check if the response indicates success
      if (response.status === 200 || response.status === 201) {
        showToast("Content added successfully! 🎉");
        
        // Reset form
        setTitle("");
        setNotes("");
        setFile(null);
        setSelectedCategoryId("");
        setSelectedTags([]);
        
        // Close modal after success
        setTimeout(() => {
          if (typeof onClose === 'function') {
            onClose();
          }
        }, 1500);
        
      } else {
        throw new Error("Failed to add content");
      }

    } catch (error) {
      console.error("Error adding content:", error);
      
      // Check for specific error messages from API
      if (error.response && error.response.data && error.response.data.message) {
        showToast(error.response.data.message, "error");
      } else if (error.message) {
        showToast(error.message, "error");
      } else {
        showToast("Failed to add content. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle close button click
  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  // Get file icon based on type
  const getFileIcon = (file) => {
    if (file && file.type.startsWith('image/')) {
      return "🖼️";
    } else if (file && file.type === 'application/pdf') {
      return "📄";
    }
    return "📎";
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Row - Category, Title and Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Selection */}
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Category *
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="md:col-span-2">
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
        </div>

        {/* Second Row - Notes full width */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Notes *
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            rows="3"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Enter your notes here..."
          />
        </div>

        {/* Third Row - File Upload and Tags side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Media File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-all duration-200">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.pdf,image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer block"
              >
                <div className="text-4xl mb-3">📁</div>
                <p className="text-gray-600 font-medium mb-1 text-lg">
                  {file ? "Change File" : "Choose a file"}
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG, GIF, PDF (Max 10MB)
                </p>
              </label>
            </div>

            {/* File Preview */}
            {file && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
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
                    className="text-red-500 hover:text-red-700 text-lg font-bold transition-colors"
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
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-40"
            >
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id} className="py-2">
                  {tag.tag}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Hold Ctrl/Cmd to select multiple tags
            </p>
          </div>
        </div>

        {/* Fourth Row - Add New Tag full width */}
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
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
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
                Saving...
              </span>
            ) : (
              "Save Content"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload;