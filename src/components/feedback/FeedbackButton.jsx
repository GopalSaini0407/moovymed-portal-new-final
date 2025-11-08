import React, { useState } from "react";
import Model from "../../components/model/Model";
import FeedbackForm from "./FeedbackForm";
import { useTranslation } from "react-i18next";

export default function FeedbackButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      {/* Clickable text/button to open feedback modal */}
      <span
  onClick={() => setIsModalOpen(true)}
  className="cursor-pointer rounded-md text-blue-600 hover:text-blue-800"
>
  {t("navbar.feedback")}
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
