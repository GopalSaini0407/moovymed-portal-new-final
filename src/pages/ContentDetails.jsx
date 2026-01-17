import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import EditContentForm from "../components/EditContentForm";
import MediaModal from "../components/MediaModal";
import api from "../api/axiosInstance";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";
import Model from "../components/model/Model";
import { toast } from "react-toastify";
import Footer from "../components/Footer";

export default function ContentDetail() {
  const { cat_id, id } = useParams();
  const navigate = useNavigate();
  const language = useLanguage();
  const { t } = useTranslation();

  const [content, setContent] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchContent = async () => {
    try {
      const res = await api.get(`/category-content/get/${id}`, {
        headers: { "X-Locale": language },
      });
      setContent(res.data.data.contentData);
      setTags(res.data.data.contentTags);
    } catch (err) {
      setContent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchContent();
  }, [id, language]);

  useEffect(() => {
    if (!loading && !content) {
      navigate(`/category/${cat_id}`, { replace: true });
    }
  }, [loading, content, cat_id, navigate]);

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await api.get(`/category-content/delete/${id}`, {
        headers: { "X-Locale": language },
      });
      toast.success(t("content-detail-modal.alerts.delete-success"));
      navigate(`/category/${cat_id}`, { replace: true });
    } catch (err) {
      toast.error(t("content-detail-Modal.alerts.delete-fail"));
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const renderMedia = (media) => {
    if (!media) return null;

    const handleClick = (file) => {
      setSelectedMedia(file);
      setMediaModalOpen(true);
    };

    const renderFile = (file, index) => {
      if (file.endsWith(".mp4")) {
        return (
          <video
            key={index}
            controls
            className="w-60 h-60 rounded-2xl border shadow-sm cursor-pointer"
            onClick={() => handleClick(file)}
          >
            <source src={file} type="video/mp4" />
          </video>
        );
      }

      if (file.endsWith(".pdf")) {
        return (
          <div
            key={index}
            onClick={() => handleClick(file)}
            className="w-60 h-60 rounded-2xl border shadow-sm flex items-center justify-center bg-gray-100 cursor-pointer text-lg"
          >
            📄 PDF
          </div>
        );
      }

      return (
        <img
          key={index}
          src={file}
          alt=""
          onClick={() => handleClick(file)}
          className="w-60 h-60 object-cover rounded-2xl shadow-sm cursor-pointer"
        />
      );
    };

    if (Array.isArray(media)) {
      return <div className="flex flex-wrap gap-4 justify-center">{media.map(renderFile)}</div>;
    }

    return renderFile(media, 0);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-2xl shadow-sm p-6 bg-white/80 backdrop-blur">
          <button
            onClick={() => navigate(`/category/${cat_id}`)}
            className="text-blue-600 mb-4"
          >
            ← {t("content-detail.back")}
          </button>

          <h2 className="text-2xl font-semibold text-center">{content?.title}</h2>
          <p className="text-center text-gray-500 mt-1">{content?.notes}</p>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
              >
                {tag.tag}
              </span>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setEditModalOpen(true)}
              className="px-5 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white"
            >
              {t("content-detail.buttons.edit")}
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="px-5 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"
            >
              {t("content-detail.buttons.delete")}
            </button>
          </div>
        </div>

        <div className="rounded-2xl shadow-sm p-6 bg-white/80 backdrop-blur flex justify-center">
          {renderMedia(content?.media_file)}
        </div>
      </div>

      {/* Edit Modal */}
      <Model
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={t("edit-content.title")}
        size="lg"
      >
        <EditContentForm
          id={id}
          onClose={() => setEditModalOpen(false)}
          onSuccess={fetchContent}
        />
      </Model>

      {/* Media Preview Modal */}
      <Model
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        title={t("media-file.preview_document")}
        size="lg"
      >
        <MediaModal
          fileUrl={selectedMedia}
          isOpen={mediaModalOpen}
          onClose={() => setMediaModalOpen(false)}
        />
      </Model>

      {/* Delete Confirmation Modal */}
      <Model
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("content-detail-modal.alerts.delete-confirm-title")}
        size="sm"
      >
        <p className="text-gray-600 text-center mb-6">
          {t("content-detail-modal.alerts.delete-confirm")}
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="px-4 py-2 border rounded-lg"
            disabled={deleting}
          >
            {t("common.cancel")}
          </button>

          <button
            onClick={handleDeleteConfirm}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {deleting ? t("common.deleting") : t("common.confirm")}
          </button>
        </div>
      </Model>

      <Footer />
    </MainLayout>
  );
}
