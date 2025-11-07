import LoginForm from "../features/auth/LoginForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
