// import ForgotPasswordForm from "../features/auth/ForgetPasswordForm";
import ResetPasswordForm from "../features/auth/ResetPasswordForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ResetPasswordForm />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ResetPassword;
