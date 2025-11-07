import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaTimes, FaEdit, FaPlus } from "react-icons/fa";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

export default function SettingsTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newTag, setNewTag] = useState("");

  const BASE_URL = "https://app.moovymed.de/api/v1";
  const token = localStorage.getItem("token"); // ✅ token from localStorage

  // ✅ Fetch tags on component mount
  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/tags`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTags(res.data.data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
      alert("Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // ✅ Create new tag (from Modal)
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return alert("Please enter a tag name");

    try {
      const res = await axios.post(
        `${BASE_URL}/tag/create`,
        { tag: newTag },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTags((prev) => [...prev, res.data.data]);
      setShowModal(false);
      setNewTag("");
    } catch (error) {
      console.error("Error creating tag:", error);
      alert("Failed to create tag");
    }
  };

  // ✅ Update tag
  const handleUpdate = async (id, oldTag) => {
    const updatedTag = prompt("Edit tag name:", oldTag);
    if (!updatedTag || updatedTag === oldTag) return;

    try {
      await axios.post(
        `${BASE_URL}/tag/update/${id}`,
        { tag: updatedTag },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTags((prev) =>
        prev.map((t) => (t.id === id ? { ...t, tag: updatedTag } : t))
      );
    } catch (error) {
      console.error("Error updating tag:", error);
      alert("Failed to update tag");
    }
  };

  // ✅ Delete tag
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tag?")) return;

    try {
      await axios.get(`${BASE_URL}/tag/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting tag:", error);
      alert("Failed to delete tag");
    }
  };

  return (
    <MainLayout>
<div className="max-w-6xl mx-auto p-6 rounded-2xl"
    style={{
      backdropFilter: "blur(20px)",
      backgroundColor: "rgba(255, 255, 255, 0.75)",
    }}
    >
      {/* Back button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-900">Tag Settings</h2>
        <p className="text-gray-600 mt-1">Manage and edit your Tags here.</p>
      </div>

      {/* Add Tag Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          <FaPlus /> Add Tag
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading tags...</p>}

      {/* Tag List */}
      <div className="flex flex-wrap gap-3">
        {tags.length === 0 && !loading && (
          <p className="text-gray-500">No tags found.</p>
        )}

        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium transition"
          >
            <span
              className="cursor-pointer hover:underline"
              onClick={() => handleUpdate(tag.id, tag.tag)}
              title="Click to edit"
            >
              {tag.tag}
            </span>

            <FaEdit
              className="ml-2 cursor-pointer hover:text-blue-600"
              onClick={() => handleUpdate(tag.id, tag.tag)}
              title="Edit tag"
            />
            <FaTimes
              className="ml-2 cursor-pointer hover:text-red-500"
              onClick={() => handleDelete(tag.id)}
              title="Delete tag"
            />
          </div>
        ))}
      </div>

      {/* ✅ Modal for Add Tag */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              <FaTimes size={18} />
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Tag
            </h3>

            <form onSubmit={handleAddTag}>
              <label className="block text-gray-700 text-sm mb-2">
                Tag Name
              </label>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter tag name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </MainLayout>
    
  );
}
  