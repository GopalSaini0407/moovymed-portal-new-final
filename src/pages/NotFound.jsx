import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Img from "../assets/dribbble_1.gif"

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-center px-6 text-white"
      style={{
        background:
          "linear-gradient(135deg, rgba(79, 177, 231, 1) 0%, rgba(255, 0, 117, 1) 100%)",
      }}
    >
      {/* Glowing light effect */}
      <div className="absolute inset-0 bg-white/10 blur-3xl opacity-30 animate-pulse"></div>

      {/* Big 404 Text */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-8xl md:text-9xl font-extrabold tracking-widest drop-shadow-lg"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-6 text-2xl md:text-3xl font-semibold drop-shadow"
      >
        Oops! Page Not Found
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-4 max-w-md text-white/90"
      >
        The page you’re looking for doesn’t exist or has been moved.
        <br />
        Check the URL or go back to the homepage.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-8 flex flex-col sm:flex-row gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full shadow-md hover:bg-white/30 transition text-white"
        >
          <ArrowLeft size={20} />
          Go Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="px-6 py-3 cursor-pointer bg-white text-pink-600 font-medium rounded-full shadow-md hover:bg-gray-100 transition"
        >
          Go to Homepage
        </motion.button>
      </motion.div>

      {/* Working Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-12"
      >
        <motion.img
          src={Img}
          alt="Page Not Found Illustration"
          className="w-80 mx-auto rounded-lg shadow-2xl"
          animate={{ y: [0, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </main>
  );
};

export default NotFound;
