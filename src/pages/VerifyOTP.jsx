// import ForgotPasswordForm from "../features/auth/ForgetPasswordForm";
import VerifyOTPForm from "../features/auth/VerifyOTPForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyOTP = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <VerifyOTPForm />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default VerifyOTP;
