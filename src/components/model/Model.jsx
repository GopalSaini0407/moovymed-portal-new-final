import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

const Model = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md", // Default size
}) => {
  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Define width & height classes for different modal sizes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "w-[95vw] h-[90vh]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Container */}
          <motion.div
            className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} relative flex flex-col max-h-[90vh]`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 px-5 py-4 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition"
                aria-label="Close"
              >
                <AiOutlineClose
                  size={25}
                  className="text-red-600 hover:text-red-800"
                />
              </button>
            </div>

            {/* Content area (scrollable if content overflows) */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Model;
