import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import AuthNavbar from "../../components/navbar/AuthNavbar";
import { useTranslation } from "react-i18next";
import whiteLogo from "../../assets/whiteLogo.svg";
import  {useLanguage}  from "../../hooks/useLanguage";
import api from "../../api/axiosInstance"; // ✅ axios instance
import { Eye, EyeOff } from "lucide-react";
import Footer from "../../components/Footer";

const LoginForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const language = useLanguage();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/"); // redirect to dashboard
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      setUsernameError(t("toast.value-required"));
      return;
    }

    if (!username || !password) {
      toast.error(t("toast.missing-credentials"));
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      // Axios login call
      const res = await api.post("/user/login", params, {
        headers: {
          "X-Locale": language,
        },
      });

      const data = res.data;

      if (res.status === 200 && data.access_token) {
        // Store tokens
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.access_token); // same as access_token
        localStorage.setItem("expires_in", data.expires_in || "");
        localStorage.setItem("token_type", data.token_type || "bearer");

        toast.success(t("toast.login-success") || "Login successful!");
        navigate("/"); // redirect to dashboard
      } else {
        toast.error(t("toast.login-failed") || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(t(err.message||"toast.server-error") || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameError(value ? "" : t("toast.value-required"));
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, rgba(79, 177, 231, 1) 0%, rgba(255, 0, 117, 1) 100%)",
      }}
    >
      <AuthNavbar />

      <main className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={whiteLogo} alt="Logo" className="h-12 filter brightness-0 invert" />
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} autoComplete="on" className="space-y-6">
                <div className="text-center">
                  <h5 className="text-2xl font-semibold text-gray-800">{t("login.title")}</h5>
                  <p className="text-sm text-gray-600 leading-relaxed">{t("login.welcome")}</p>
                </div>

                {/* Username */}
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={username}
                      autoComplete="username"

                      onChange={handleUsernameChange}
                      className={`peer w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                        usernameError
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                      placeholder=" "
                    />
                    <label
                      htmlFor="username"
                      className={`absolute left-4 top-3 px-1 bg-white transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:-translate-y-1/2 ${
                        username || usernameError
                          ? "top-0 text-xs transform -translate-y-1/2"
                          : ""
                      } ${
                        usernameError
                          ? "text-red-500"
                          : "text-gray-500 peer-focus:text-blue-500"
                      }`}
                    >
                      {t("login.username")}
                    </label>
                  </div>
                  {usernameError && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {usernameError}
                    </p>
                  )}
                </div>

              {/* Password */}
<div className="space-y-1">
  <div className="relative">
    <input
      id="password"
      name="password"
      type={passwordVisible ? "text" : "password"}   // 👈 toggle show/hide
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition pr-10"
      placeholder=" "
       autoComplete="current-password"
    />
    <label
      htmlFor="password"
      className="absolute left-4 top-3 px-1 bg-white text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base"
    >
      {t("login.password")}
    </label>

    {/* 👁️ Eye icon for show/hide password */}
    <button
      type="button"
      onClick={() => setPasswordVisible(!passwordVisible)}
      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
    >
      {passwordVisible ? (
        <EyeOff size={20} />
      ) : (
        <Eye size={20} />
      )}
    </button>
  </div>
</div>


                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white shadow-md transition ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-400 hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : t("login.button")}
                  </button>
                </div>

                {/* Links */}
                <div className="space-y-3 pt-4 text-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
                  >
                    {t("login.forget-password")}
                  </Link>
                  <div className="text-sm text-gray-600">
                    {t("login.no-account")}{" "}
                    <Link
                      to="/register"
                      className="text-blue-600 hover:text-blue-800 hover:underline transition"
                    >
                      {t("login.create-one")}
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default LoginForm;
