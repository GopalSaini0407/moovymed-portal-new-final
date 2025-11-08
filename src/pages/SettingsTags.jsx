import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaTimes, FaEdit, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axiosInstance";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";

export default function SettingsTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [editTag, setEditTag] = useState({ id: null, tag: "" });

  const { t } = useTranslation();
  const language = useLanguage();

  // ✅ Fetch tags
  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tags`, {
        headers: { "X-Locale": language },
      });
      setTags(res.data.data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error(t("settings-tags.error-fetch"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [language]);

  // ✅ Create new tag
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return toast.warning(t("settings-tags.alert.empty-tag"));

    try {
      const res = await api.post(
        `/tag/create`,
        { tag: newTag },
        { headers: { "X-Locale": language } }
      );
      setTags((prev) => [...prev, res.data.data]);
      setShowAddModal(false);
      setNewTag("");
      toast.success(t("settings-tags.toast.add-success"));
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error(t("settings-tags.error-create"));
    }
  };

  // ✅ Open edit modal
  const openEditModal = (id, tag) => {
    setEditTag({ id, tag });
    setShowEditModal(true);
  };

  // ✅ Update tag
  const handleUpdateTag = async (e) => {
    e.preventDefault();
    if (!editTag.tag.trim())
      return toast.warning(t("settings-tags.alert.empty-tag"));

    try {
      await api.post(
        `/tag/update/${editTag.id}`,
        { tag: editTag.tag },
        { headers: { "X-Locale": language } }
      );
      setTags((prev) =>
        prev.map((t) => (t.id === editTag.id ? { ...t, tag: editTag.tag } : t))
      );
      setShowEditModal(false);
      toast.success(t("settings-tags.toast.update-success"));
    } catch (error) {
      console.error("Error updating tag:", error);
      toast.error(t("settings-tags.error-update"));
    }
  };

  // ✅ Delete tag
  const handleDelete = async (id) => {
    try {
      await api.get(`/tag/delete/${id}`, { headers: { "X-Locale": language } });
      setTags((prev) => prev.filter((t) => t.id !== id));
      toast.success(t("settings-tags.toast.delete-success"));
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error(t("settings-tags.error-delete"));
    }
  };

  return (
    <MainLayout>
      <div
        className="max-w-6xl mx-auto p-6 rounded-2xl"
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
          <FaArrowLeft /> {t("settings-tags.back")}
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-gray-900">
            {t("settings-tags.title")}
          </h2>
          <p className="text-gray-600 mt-1">{t("settings-tags.description")}</p>
        </div>

        {/* Add Tag Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            <FaPlus /> {t("settings-tags.add-tag")}
          </button>
        </div>

        {/* Loading */}
        {loading && <p className="text-gray-500">{t("settings-tags.loading")}</p>}

        {/* Tag List */}
        <div className="flex flex-wrap gap-3">
          {tags.length === 0 && !loading && (
            <p className="text-gray-500">{t("settings-tags.no-tags")}</p>
          )}

          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium transition"
            >
              <span
                className="cursor-pointer hover:underline"
                onClick={() => openEditModal(tag.id, tag.tag)}
                title={t("settings-tags.tooltip.edit")}
              >
                {tag.tag}
              </span>

              <FaEdit
                className="ml-2 cursor-pointer hover:text-blue-600"
                onClick={() => openEditModal(tag.id, tag.tag)}
                title={t("settings-tags.tooltip.edit")}
              />
              <FaTimes
                className="ml-2 cursor-pointer hover:text-red-500"
                onClick={() => handleDelete(tag.id)}
                title={t("settings-tags.tooltip.delete")}
              />
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative animate-fadeIn">
              {/* Close */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                onClick={() => setShowAddModal(false)}
              >
                <FaTimes size={18} />
              </button>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t("settings-tags.modal.title")}
              </h3>

              <form onSubmit={handleAddTag}>
                <label className="block text-gray-700 text-sm mb-2">
                  {t("settings-tags.modal.label")}
                </label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder={t("settings-tags.modal.placeholder")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <div className="flex justify-end gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    {t("settings-tags.modal.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    {t("settings-tags.modal.save")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative animate-fadeIn">
              {/* Close */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                onClick={() => setShowEditModal(false)}
              >
                <FaTimes size={18} />
              </button>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t("settings-tags.modal.edit-title")}
              </h3>

              <form onSubmit={handleUpdateTag}>
                <label className="block text-gray-700 text-sm mb-2">
                  {t("settings-tags.modal.label")}
                </label>
                <input
                  type="text"
                  value={editTag.tag}
                  onChange={(e) =>
                    setEditTag((prev) => ({ ...prev, tag: e.target.value }))
                  }
                  placeholder={t("settings-tags.modal.placeholder")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <div className="flex justify-end gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    {t("settings-tags.modal.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    {t("settings-tags.modal.save")}
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
