// // src/features/auth/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import axiosInstance from "../../api/axiosInstance";
// import { toast } from "react-toastify";

// const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem("token");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });
//   const [loading, setLoading] = useState(false);

//   // ----------------- LOGIN -----------------
//   const login = async (username, password) => {
//     try {
//       setLoading(true);
//       const formData = new URLSearchParams();
//       formData.append("username", username);
//       formData.append("password", password);
      
//       const response = await axiosInstance.post(
//         "/api/v1/user/login",
//         formData.toString(),
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             Accept: "application/json",
//           },
//         }
//       );
//        console.log(formData)
//       if (response.data?.status === "success") {
//         const userData = response.data.user;
//             console.log(userData)
//         // Save user in state and localStorage
//         setUser(userData);
//         localStorage.setItem("token", JSON.stringify(userData));

//         toast.success("Login successful");
//         return true;
//       } else {
//         toast.error(response.data?.message || "Login failed");
//         return false;
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----------------- LOGOUT -----------------
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("token");
//     toast.info("Logged out successfully");
//     window.location.href = "/login";
//   };

//   // ----------------- REGISTER -----------------
//   const register = async (form) => {
//     try {
//       setLoading(true);
//       const formData = new URLSearchParams();
//       Object.keys(form).forEach((key) => formData.append(key, form[key]));

//       const response = await axiosInstance.post(
//         "/api/v1/user/register",
//         formData.toString(),
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data?.status === "success") {
//         toast.success("Registration successful! Please login.");
//         return true;
//       } else {
//         toast.error(response.data?.message || "Registration failed");
//         return false;
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----------------- FORGOT PASSWORD -----------------
//   const forgetPassword = async (email) => {
//     try {
//       setLoading(true);
//       const formData = new URLSearchParams();
//       formData.append("email", email);

//       const response = await axiosInstance.post(
//         "/api/v1/user/forget-password",
//         formData.toString()
//       );

//       if (response.data?.user_id) {
//         localStorage.setItem("reset_user_id", response.data.user_id);
//         toast.success(response.data.message || "OTP sent to your email");
//         return true;
//       } else {
//         toast.error(response.data?.message || "Failed to send OTP");
//         return false;
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----------------- VERIFY OTP -----------------
//   const verifyOTP = async (otp) => {
//     try {
//       setLoading(true);
//       const id = localStorage.getItem("reset_user_id");

//       const response = await axiosInstance.post(
//         "/api/v1/user/forget-password/verify-otp",
//         { id, otp }
//       );

//       if (response.data?.status === "success") {
//         toast.success("OTP verified successfully!");
//         return true;
//       } else {
//         toast.error(response.data?.message || "Invalid OTP");
//         return false;
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----------------- RESET PASSWORD -----------------
//   const resetPassword = async (password, password_confirmation) => {
//     try {
//       setLoading(true);
//       const id = localStorage.getItem("reset_user_id");

//       const response = await axiosInstance.post(
//         "/api/v1/user/reset-password",
//         { id, password, password_confirmation }
//       );

//       if (response.data?.status === "success") {
//         toast.success("Password reset successfully!");
//         localStorage.removeItem("reset_user_id");
//         return true;
//       } else {
//         toast.error(response.data?.message || "Password reset failed");
//         return false;
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----------------- PROVIDER -----------------
//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         login,
//         logout,
//         register,
//         forgetPassword,
//         verifyOTP,
//         resetPassword,
//         setUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
