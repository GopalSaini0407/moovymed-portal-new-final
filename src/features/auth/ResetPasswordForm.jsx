import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import whiteLogo from "../../assets/whiteLogo.svg";
import AuthNavbar from "../../components/navbar/AuthNavbar";
import  {useLanguage}  from "../../hooks/useLanguage";
import api from "../../api/axiosInstance"; // ✅ axios instance
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";

const ResetPasswordForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    password_confirmation: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const language = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    // ✅ Get user ID from localStorage (set in verify-otp step)
    const storedId = localStorage.getItem("reset_user_id");
    if (!storedId) {
      toast.error("Session expired. Please start again.");
      navigate("/forgot-password");
      return;
    }
    setId(storedId);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "password_confirmation") setPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 🧠 Validation
    if (!form.password || !form.password_confirmation) {
      toast.warn("Please fill all fields");
      return;
    }
  
    if (form.password !== form.password_confirmation) {
      setPasswordError("Passwords do not match");
      return;
    }
  
    if (form.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
  
    try {
      setLoading(true);
  
      // 🧩 API Call using Axios instance
      const response = await api.post(
        "/user/reset-password",
        {
          id, // same user ID saved from OTP verification
          password: form.password,
          password_confirmation: form.password_confirmation,
        },
        {
          headers: {
            "X-Locale": language,
            "Content-Type": "application/json",
          },
        }
      );
  
      const data = response.data;
  
      if (data?.status === "success") {
        toast.success(data.message || "Password reset successfully!");
        localStorage.removeItem("reset_user_id"); // clear saved ID
        navigate("/login");
      } else {
        toast.error(data?.message || "Password reset failed!");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong! Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
    <AuthNavbar/>
    <div className="min-h-screen w-full flex flex-col" style={{ background:"linear-gradient(135deg, rgba(79, 177, 231, 1) 0%, rgba(255, 0, 117, 1) 100%)" }}>
    <main className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
  <div className="max-w-md w-full">
    {/* Logo */}
    <div className="flex justify-center mb-8">
      <div className="bg-opacity-20 rounded-lg p-4">
        <img
          src={whiteLogo}
          alt="Logo"
          className="h-12 filter brightness-0 invert"
        />
      </div>
    </div>

    {/* Reset Password Card */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Description */}
          <div className="text-center">
            <h5 className="text-2xl font-semibold text-gray-800">
              {t("reset-password.title")}
            </h5>
            <p className="text-sm text-gray-600 mt-1">
              {t("reset-password.description")}
            </p>
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-3 px-1 bg-white text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:transform peer-focus:-translate-y-1/2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base"
              >
                {t("reset-password.new-password")}
              </label>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <div className="relative">
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={handleChange}
                className={`peer w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  passwordError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
                placeholder=" "
              />
              <label
                htmlFor="password_confirmation"
                className="absolute left-4 top-3 px-1 bg-white text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:transform peer-focus:-translate-y-1/2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base"
              >
                {t("reset-password.confirm-password")}
              </label>
            </div>

            {passwordError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {passwordError}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white shadow-md transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("reset-password.button")}...
                </span>
              ) : (
                t("reset-password.button")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</main>
<Footer/>
    </div>
    </>
    
  );
};

export default ResetPasswordForm;
