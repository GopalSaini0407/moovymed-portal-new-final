import React, { useState, useRef } from "react";
import api from "../../api/axiosInstance";
import { useLanguage } from "../../hooks/useLanguage";

export default function FeedbackForm({ onCancel }) {
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState("");
  const [touched, setTouched] = useState({ title: false, feedback: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const titleRef = useRef(null);

  const language = useLanguage();

  const errors = {
    title: title.trim() === "" ? "Value required." : "",
    feedback: feedback.trim() === "" ? "Please enter your feedback." : "",
  };

  const isValid = !errors.title && !errors.feedback;

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ title: true, feedback: true });
    if (!isValid) return;

    setLoading(true);
    setMessage("");

    const payload = {
      title: title.trim(),
      feedback: feedback.trim(),
    };

    try {
      setLoading(true);
    
      const res = await api.post(
        "/user/feedback",
        {
          title,   
          feedback,
        },
        {
          headers: {
            "X-Locale": language,
          },
        }
      );
    
      if (res.status === 200) {
        setMessage(res.data.message || "Feedback sent successfully!");
        setTitle("");
        setFeedback("");
        setTouched({ title: false, feedback: false });
      } else {
        setMessage(res.data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
    
  }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit}
      className="flex flex-col bg-white rounded-2xl shadow p-6 max-w-lg mx-auto"
    >
      {/* Content */}
      <div className="space-y-4">
        <p className="text-md text-gray-600 text-left">
          Send us your wishes, improvement suggestions, or error messages.  
          We’re grateful for every hint.  
          Alternatively, you can also email us at{" "}
          <a href="mailto:support@moovymed.de" className="underline text-indigo-600">
            support@moovymed.de
          </a>.
        </p>

        {/* Title field */}
        <div className="flex flex-col">
          <label
            htmlFor="inputTitle"
            className={`mb-1 text-left text-sm font-medium ${
              errors.title && touched.title ? "text-red-600" : "text-gray-700"
            }`}
          >
            Title <span aria-hidden className="text-red-600">*</span>
          </label>
          <input
            id="inputTitle"
            ref={titleRef}
            placeholder="Title"
            required
            aria-required
            aria-invalid={!!(errors.title && touched.title)}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, title: true }))}
            className={`w-full rounded-lg border px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow ${
              errors.title && touched.title
                ? "border-red-300 bg-red-50"
                : "border-gray-200"
            }`}
          />
          {errors.title && touched.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Feedback field */}
        <div className="flex flex-col">
          <label
            htmlFor="inputFeedback"
            className={`mb-1 text-sm font-medium text-left ${
              errors.feedback && touched.feedback
                ? "text-red-600"
                : "text-gray-700"
            }`}
          >
            Your feedback <span aria-hidden className="text-red-600">*</span>
          </label>
          <textarea
            id="inputFeedback"
            placeholder="Content"
            required
            aria-required
            aria-invalid={!!(errors.feedback && touched.feedback)}
            value={feedback}
            rows={3}
            onChange={(e) => setFeedback(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, feedback: true }))}
            className={`w-full rounded-lg border px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow resize-none ${
              errors.feedback && touched.feedback
                ? "border-red-300 bg-red-50"
                : "border-gray-200"
            }`}
          />
          {errors.feedback && touched.feedback && (
            <p className="mt-1 text-sm text-red-600">{errors.feedback}</p>
          )}
        </div>

        {/* Response message */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.toLowerCase().includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white ${
            isValid && !loading
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-indigo-400/60 cursor-not-allowed"
          } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
          disabled={!isValid || loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
