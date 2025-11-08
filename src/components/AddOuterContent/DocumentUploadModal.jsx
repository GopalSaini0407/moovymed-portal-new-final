import React from "react";
import DocumentUpload from "./DocumentUpload";
import { useTranslation } from "react-i18next";
import Model from "../model/Model";

export default function DocumentUploadModal({ open, onClose }) {
  const { t } = useTranslation();

  return (
    <Model
      isOpen={open}
      onClose={onClose}
      title={t("document-upload.title")}
      size="lg" // 👈 You can change: sm | md | lg | xl | full
    >
      <div className="max-h-[75vh] overflow-y-auto">
        <DocumentUpload onClose={onClose} />
      </div>
    </Model>
  );
}
