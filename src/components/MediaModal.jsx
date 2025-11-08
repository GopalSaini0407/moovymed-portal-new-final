import React from "react";
import { FaDownload, FaTimes } from 'react-icons/fa';

export default function MediaModal({ fileUrl, isOpen, onClose }) {
  if (!isOpen) return null;

  const isPDF = fileUrl?.toLowerCase().endsWith(".pdf");

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-lg px-4 py-2 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="title flex justify-between items-center pb-2">
             
              {/* Download Button */}
          <button
            onClick={handleDownload}
            className="block"
           >
            <FaDownload className="text-green-500" size={25}/>
          </button>
        
  {/* Close Button */}
         <button
          onClick={onClose}
          className=""
        >
        <FaTimes size={25} />

        </button>

        </div>
      
        {/* Media Preview */}
        <div className="flex justify-center mb-4">
          {isPDF ? (
            <iframe
              src={fileUrl}
              title="PDF Preview"
              className="w-full h-96 md:h-[500px] rounded-lg border"
            />
          ) : (
            <img
              src={fileUrl}
              alt="preview"
              className="max-h-96 md:max-h-[500px] w-auto object-contain rounded-lg"
            />
          )}
        </div>

      </div>
    </div>
  );
}
