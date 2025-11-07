import React, { useEffect, useState } from "react";
import axios from "axios";

const AddContentForm = ({ categoryId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    notes: "",
    files: [],
  });
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch existing tags
  const fetchTags = async () => {
    try {
      console.log("🔍 Fetching tags...");
      const res = await axios.get("https://app.moovymed.de/api/v1/tags", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Tags fetched:", res.data.data);
      setTags(res.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching tags:", error);
      setError("Failed to load tags");
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Add new tag
  const handleAddTag = async () => {
    if (!newTag.trim()) {
      setError("Please enter a tag name");
      return;
    }

    try {
      console.log("🆕 Adding new tag:", newTag);
      await axios.post(
        "https://app.moovymed.de/api/v1/tag/create",
        { tag: newTag.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNewTag("");
      setError("");
      fetchTags();
    } catch (error) {
      console.error("Error creating tag:", error);
      setError("Failed to create tag");
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'application/pdf', 'audio/mpeg'];
      const maxSize = 50 * 1024 * 1024;
      
      if (!validTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.name}`);
        return false;
      }
      
      if (file.size > maxSize) {
        setError(`File too large: ${file.name} (max 50MB)`);
        return false;
      }
      
      return true;
    });

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }));
    setError("");
  };

  // Remove file from selection
  const handleRemoveFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  // Handle tag selection
  const handleTagChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedTagIds = selectedOptions.map(option => option.value);
    console.log("🏷️ Selected Tags (IDs):", selectedTagIds);
    console.log("🏷️ Selected Tags (Names):", selectedOptions.map(option => option.text));
    setSelectedTags(selectedTagIds);
  };

  // Get file preview URL
  const getFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  // Get file icon based on type
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type.startsWith('video/')) return '🎥';
    if (file.type.startsWith('audio/')) return '🎵';
    if (file.type === 'application/pdf') return '📄';
    return '📎';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Submit content form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Debug logging
    console.log("🚀 Submitting form...");
    console.log("📝 Form Data:", formData);
    console.log("🏷️ Selected Tags:", selectedTags);
    console.log("📁 Files:", formData.files);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("notes", formData.notes.trim());
      formDataToSend.append("category_id", categoryId);
      
      // Append all files
      formData.files.forEach((file, index) => {
        formDataToSend.append(`media_files[${index}]`, file);
      });
      
      // Append selected tag IDs
      selectedTags.forEach((tagId, i) => {
        console.log(`📤 Appending tag[${i}]:`, tagId);
        formDataToSend.append(`tags[${i}]`, tagId);
      });

      // Log FormData contents
      console.log("📦 FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(
        "https://app.moovymed.de/api/v1/category-content/create",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Success response:", response.data);
      alert("Content added successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Error adding content:", error);
      console.error("❌ Error response:", error.response);
      setError(
        error.response?.data?.message || 
        "Failed to add content. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle keyboard events for new tag input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      formData.files.forEach(file => {
        if (file.type.startsWith('image/')) {
          URL.revokeObjectURL(getFilePreview(file));
        }
      });
    };
  }, [formData.files]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg relative">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Add New Content
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter content title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes *</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter content notes"
              />
            </div>

            {/* Multiple File Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Media Files {formData.files.length > 0 && `(${formData.files.length} selected)`}
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              />
              <p className="text-xs text-gray-500 mt-1">
                Select multiple files (Images, Videos, Audio, PDFs) - Max 50MB per file
              </p>
            </div>

            {/* File Previews */}
            {formData.files.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">Selected Files:</h4>
                <div className="space-y-3">
                  {formData.files.map((file, index) => {
                    const previewUrl = getFilePreview(file);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {previewUrl ? (
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="w-12 h-12 object-cover rounded border"
                              onLoad={() => URL.revokeObjectURL(previewUrl)}
                            />
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center bg-white border rounded text-2xl">
                              {getFileIcon(file)}
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)} • {file.type}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Remove file"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Existing tags */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Tags {selectedTags.length > 0 && `(${selectedTags.length} selected)`}
              </label>
              <select
                multiple
                value={selectedTags}
                onChange={handleTagChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.tag} {/* Display name, store ID */}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl/Cmd to select multiple tags
              </p>
              <div className="text-xs text-blue-600 mt-1">
                Debug: Selected IDs: [{selectedTags.join(", ")}]
              </div>
            </div>

            {/* Add new tag */}
            <div>
              <label className="block text-sm font-medium mb-1">Add New Tag</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter new tag name"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {loading ? "Saving..." : "Save Content"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContentForm;