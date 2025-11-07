import React, { useState } from "react";
import Model from "../../components/model/Model";
import FeedbackForm from "./FeedbackForm";

export default function FeedbackButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Clickable text/button to open feedback modal */}
      <span
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer rounded-md text-blue-600 hover:text-blue-800"
      >
        Feedback
      </span>

      {/* Feedback Modal */}
      <Model
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
        title="Give Feedback"
      >
        <FeedbackForm
          onSubmit={(data) => {
            console.log("Submitted:", data);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Model>
    </>
  );
}
