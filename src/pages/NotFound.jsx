import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
      {/* Big 404 Text */}
      <h1 className="text-8xl font-extrabold text-blue-600 tracking-widest drop-shadow-md">
        404
      </h1>

      {/* Subtitle */}
      <h2 className="mt-6 text-2xl md:text-3xl font-semibold text-gray-800">
        Oops! Page Not Found
      </h2>

      {/* Description */}
      <p className="mt-4 text-gray-600 max-w-md">
        The page you’re looking for doesn’t exist or has been moved.  
        Check the URL or go back to the homepage.
      </p>

      {/* Go Back / Home Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-full shadow-md hover:bg-blue-700 transition"
        >
          Go to Homepage
        </button>
      </div>

      {/* Optional Decorative Illustration */}
      <div className="mt-12">
        <img
          src="https://illustrations.popsy.co/gray/error-404.svg"
          alt="Not Found Illustration"
          className="w-64 mx-auto opacity-90"
        />
      </div>
    </main>
  );
};

export default NotFound;
