// VerifyOTPForm.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import whiteLogo from "../../assets/whiteLogo.svg";
import AuthNavbar from "../../components/navbar/AuthNavbar";

const VerifyOTPForm = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    // Retrieve ID from localStorage (saved in forgot-password step)
    const storedId = localStorage.getItem("reset_user_id");
    if (!storedId) {
      toast.error("Session expired. Please try again.");
      navigate("/forgot-password");
      return;
    }
    setId(storedId);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setOtpError("OTP is required");
      return;
    }

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://app.moovymed.de/api/v1/user/forget-password/verify-otp",
        { id, otp }
      );

      if (response.data?.status === "success" || response.data?.message) {
        toast.success("OTP verified successfully!");
        navigate("/reset-password");
      } else {
        toast.error(response.data?.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    if (value) setOtpError("");
  };

  return (
    <>
     <AuthNavbar/>
    <div className="min-h-screen w-full flex flex-col" style={{ background:"linear-gradient(135deg, rgba(79, 177, 231, 1) 0%, rgba(255, 0, 117, 1) 100%)" }}>
      <main className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-8">
            <div className="bg-opacity-20 rounded-lg p-4">
              <img
                src={whiteLogo}
                alt="Logo"
                className="h-12 filter brightness-0 invert"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                  <h5 className="text-2xl font-semibold text-gray-800">
                    Verify OTP
                  </h5>
                  <p className="text-sm text-gray-600 mt-1">
                    Enter the 6-digit OTP sent to your registered email
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={handleOtpChange}
                      className={`peer w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-center text-lg font-mono ${
                        otpError
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                  {otpError && (
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
                      {otpError}
                    </p>
                  )}
                </div>

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
                        Verifying...
                      </span>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>

                <div className="text-center pt-4">
                  <span className="text-sm text-gray-600">
                    Didn't receive OTP?{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 hover:underline transition"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Resend
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
   
  );
};

export default VerifyOTPForm;
