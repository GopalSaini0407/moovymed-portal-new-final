import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import EditContentForm from "../components/EditContentForm";
import MediaModal from "../components/MediaModal"; // Import
import api from "../api/axiosInstance";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "react-i18next";
import Model from "../components/model/Model";
export default function ContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false); // New
  const [selectedMedia, setSelectedMedia] = useState(null); // New

  const language = useLanguage();
  const { t } = useTranslation();

  const fetchContent = async () => {
    try {
      const res = await api.get(`/category-content/get/${id}`, {
        headers: { "X-Locale": language },
      });
      setContent(res.data.data.contentData);
      setTags(res.data.data.contentTags);
    } catch (err) {
      console.error("Error fetching content:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchContent();
  }, [id, language]);

  const handleDelete = async () => {
    if (!window.confirm(t("content-detail.alerts.delete-confirm"))) return;
    try {
      await api.get(`/category-content/delete/${id}`, {
        headers: { "X-Locale": language },
      });
      alert(t("content-detail.alerts.delete-success"));
      navigate(-1);
    } catch (err) {
      console.error("Error deleting content:", err);
      alert(t("content-detail.alerts.delete-fail"));
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
      } else if (file.endsWith(".pdf")) {
        return (
          <div
            key={index}
            className="w-60 h-60 border-amber-50 rounded-2xl shadow-sm flex items-center justify-center text-gray-700 font-semibold cursor-pointer bg-gray-100"
            onClick={() => handleClick(file)}
          >
            📄 PDF
          </div>
        );
      } else {
        return (
          <img
            key={index}
            src={file}
            alt={`media-${index}`}
            className="w-60 h-60 object-cover rounded-2xl shadow-sm cursor-pointer"
            onClick={() => handleClick(file)}
          />
        );
      }
    };

    if (typeof media === "string") return renderFile(media, 0);

    if (Array.isArray(media))
      return <div className="flex flex-wrap gap-4 justify-center">{media.map(renderFile)}</div>;

    return null;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        {t("content-detail.loading")}
      </div>
    );

  if (!content)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        {t("content-detail.no-content")}
      </div>
    );

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 🔹 Top Box - Details */}
        <div
          className="rounded-2xl shadow-sm p-6"
          style={{ backdropFilter: "blur(20px)", backgroundColor: "rgba(255, 255, 255, 0.75)" }}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t("content-detail.back")}
          </button>

          {/* Title & Notes */}
          <h2 className="text-2xl font-semibold text-center mb-2">{content.title}</h2>
          <p className="text-gray-500 text-center mb-4">{content.notes}</p>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
              >
                {t("content-detail.tags-prefix")}
                {tag.tag}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setEditModalOpen(true)}
              className="px-5 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
            >
              {t("content-detail.buttons.edit")}
            </button>
            <button
              onClick={handleDelete}
              className="px-5 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
            >
              {t("content-detail.buttons.delete")}
            </button>
          </div>
        </div>

        {/* 🔹 Bottom Box - Image / Media Section */}
        <div
          className="rounded-2xl shadow-sm p-6 flex justify-center"
          style={{ backdropFilter: "blur(20px)", backgroundColor: "rgba(255, 255, 255, 0.75)" }}
        >
          {renderMedia(content.media_file)}
        </div>
      </div>

      {/* Modals */}

      <Model
       isOpen={editModalOpen}
       onClose={() => setEditModalOpen(false)}
       title="Edit Document"
       size="lg" // sm | md | lg | xl | full
      >
      <EditContentForm id={id} onClose={() => setEditModalOpen(false)} onSuccess={fetchContent} />

      </Model>
      
      <Model
       isOpen={mediaModalOpen}
       onClose={() => setMediaModalOpen(false)}
       title="preview Document"
       size="lg" // sm | md | lg | xl | full
      >
       <MediaModal fileUrl={selectedMedia} isOpen={mediaModalOpen} onClose={() => setMediaModalOpen(false)} />

      </Model>
    </MainLayout>
  );
}
