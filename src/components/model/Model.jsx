import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

const Model = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md", // 👈 Default size
}) => {
  // 👇 Define different width classes for each size
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "w-[90vw] h-[90vh] overflow-y-auto",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`bg-white rounded-2xl overflow-hidden shadow-lg p-6 w-full ${sizeClasses[size]} relative`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="flex justify-between align-center">
             {/* Close Button */}
            <button
                 onClick={onClose}
               className="absolute top-5 right-3 text-gray-500 hover:text-gray-700 text-xl"
             >
              <AiOutlineClose size={20} className="text-gray-600 hover:text-gray-800" />
            </button>

            {/* Title */}
            {title && (
              <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
            )}
            </div>
        

            {/* Modal Body */}
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Model;
