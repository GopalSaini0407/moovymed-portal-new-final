import LoginForm from "../features/auth/LoginForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  return (
    <>     
      <LoginForm />
      <ToastContainer position="top-right" autoClose={3000} />

    </>
  );
};

export default Login;
