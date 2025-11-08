import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../../components/navbar/AuthNavbar";
import whiteLogo from "../../assets/whiteLogo.svg";
import  {useLanguage}  from "../../hooks/useLanguage";
import api from "../../api/axiosInstance"; // ✅ axios instance
import { useTranslation } from "react-i18next";

const ForgetPasswordForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("Value required.");

  const language = useLanguage();

  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email) {
      setEmailError("Value required.");
      return;
    }
  
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
  
      // ✅ Axios POST request
      const response = await api.post("/user/forget-password", formData, {
        headers: {
          "X-Locale": language,
          "Content-Type": "application/x-www-form-urlencoded", // important for URLSearchParams
        },
      });
  
      const data = response.data; // Axios automatically parses JSON
  
      if (!response.status || !data.user_id) {
        throw new Error(data.message || "Failed to send OTP");
      }
  
      // ✅ Save user_id for next step (OTP verification)
      localStorage.setItem("reset_user_id", data.user_id);
  
      toast.success(data.message || "OTP has been sent to your registered email.");
  
      // ✅ Navigate to OTP verification page
      navigate("/verify-otp");
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      setEmailError("");
    } else {
      setEmailError("Value required.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background:"linear-gradient(135deg, rgba(79, 177, 231, 1) 0%, rgba(255, 0, 117, 1) 100%)" }}>
      {/* Navbar */}
      <AuthNavbar />

    <main className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
  <div className="max-w-md w-full">
    {/* White Logo */}
    <div className="flex justify-center mb-8">
      <div className="bg-opacity-20 rounded-lg p-4">
        <img
          src={whiteLogo}
          alt="Logo"
          className="h-12 filter brightness-0 invert"
        />
      </div>
    </div>

    {/* Forget Password Form */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8">
        <form onSubmit={handleSubmit} autoComplete="on" className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <h5 className="text-2xl font-semibold text-gray-800">
              {t("forgot-password.title")}
            </h5>
          </div>

          {/* Description */}
          <div className="text-center">
            <p className="text-sm text-gray-600 leading-relaxed">
              {t("forgot-password.description")}
            </p>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                className={`peer w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  emailError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
                placeholder=" "
              />
              <label
                htmlFor="email"
                className={`absolute left-4 top-3 px-1 bg-white transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:transform peer-focus:-translate-y-1/2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base ${
                  email || emailError
                    ? "top-0 text-xs transform -translate-y-1/2"
                    : ""
                } ${
                  emailError
                    ? "text-red-500"
                    : "text-gray-500 peer-focus:text-blue-500"
                }`}
              >
                {t("forgot-password.email")}
              </label>
            </div>
            {emailError && (
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
                {t("forgot-password.email-required")}
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
                  {t("forgot-password.button")}
                </span>
              ) : (
                t("forgot-password.button")
              )}
            </button>
          </div>

          {/* Additional Links */}
          <div className="space-y-3 pt-4">
            <div className="text-center">
              <span className="text-sm text-gray-600">
                {t("forgot-password.remember-password")}{" "}
                <a
                  href="/"
                  className="text-blue-600 hover:text-blue-800 hover:underline transition"
                >
                  {t("forgot-password.back-to-login")}
                </a>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</main>

      {/* Footer */}
      <footer className="bg-white bg-opacity-90 py-4 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-4">
            <a
              href="/legal"
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Legal
            </a>
            <span className="text-sm text-gray-600">|</span>
            <a
              href="/privacy"
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ForgetPasswordForm;
