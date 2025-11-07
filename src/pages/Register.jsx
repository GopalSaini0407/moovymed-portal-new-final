import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterForm from "../features/auth/RegisterForm";

const Register = () => {
  return (
        <>
          <RegisterForm />
        <ToastContainer position="top-right" autoClose={3000} />

        </>
      
      

   
  );
};

export default Register;
