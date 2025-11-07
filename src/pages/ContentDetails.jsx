import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import EditContentForm from "../components/EditContentForm";

export default function ContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://app.moovymed.de/api/v1/category-content/get/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this content?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.get(
        `https://app.moovymed.de/api/v1/category-content/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("🗑️ Deleted Successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error deleting content:", err);
      alert("❌ Delete failed. Check console.");
    }
  };

  const renderMedia = (media) => {
    if (!media) return null;

    if (typeof media === "string") {
      if (media.endsWith(".mp4")) {
        return (
          <video controls className="w-60 h-60 rounded-2xl border shadow-sm">
            <source src={media} type="video/mp4" />
          </video>
        );
      } else if (media.endsWith(".pdf")) {
        return (
          <iframe
            src={media}
            title="PDF"
            className="w-60 h-60 border rounded-2xl shadow-sm"
          ></iframe>
        );
      } else {
        return (
          <img
            src={media}
            alt="media"
            className="w-60 h-60 object-cover rounded-2xl border shadow-sm"
          />
        );
      }
    }

    if (Array.isArray(media)) {
      return (
        <div className="flex flex-wrap gap-4 justify-center">
          {media.map((file, index) =>
            file.endsWith(".mp4") ? (
              <video
                key={index}
                controls
                className="w-60 h-60 rounded-2xl border shadow-sm"
              >
                <source src={file} type="video/mp4" />
              </video>
            ) : file.endsWith(".pdf") ? (
              <iframe
                key={index}
                src={file}
                title={`PDF-${index}`}
                className="w-60 h-60 border rounded-2xl shadow-sm"
              ></iframe>
            ) : (
              <img
                key={index}
                src={file}
                alt={`media-${index}`}
                className="w-60 h-60 object-cover rounded-2xl border shadow-sm"
              />
            )
          )}
        </div>
      );
    }

    return null;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );

  if (!content)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No content found.
      </div>
    );

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 🔹 Top Box - Details */}
        <div
          className="rounded-2xl shadow-sm p-6"
          style={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          }}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          {/* Title & Notes */}
          <h2 className="text-2xl font-semibold text-center mb-2">
            {content.title}
          </h2>
          <p className="text-gray-500 text-center mb-4">{content.notes}</p>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
              >
                #{tag.tag}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setEditModalOpen(true)}
              className="px-5 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-5 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
            >
              Delete
            </button>
          </div>
        </div>

        {/* 🔹 Bottom Box - Image / Media Section */}
        <div
          className="rounded-2xl shadow-sm p-6 flex justify-center"
          style={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          }}
        >
          {renderMedia(content.media_file)}
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <EditContentForm
          id={id}
          onClose={() => setEditModalOpen(false)}
          onSuccess={fetchContent}
        />
      )}
    </MainLayout>
  );
}
