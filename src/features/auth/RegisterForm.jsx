import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import AuthNavbar from "../../components/navbar/AuthNavbar";
import whiteLogo from "../../assets/whiteLogo.svg";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "email" && value) setEmailError("");
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.username || !form.name || !form.email || !form.password) {
      toast.warn("Please fill all fields");
      return;
    }

    if (!validateEmail(form.email)) {
      setEmailError("Invalid email format");
      return;
    }

    if (form.password !== form.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://app.moovymed.de/api/v1/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed. Try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background:"linear-gradient(135deg, rgba(79, 177, 231, 1) 0%, rgba(255, 0, 117, 1) 100%)" }}>
      <AuthNavbar />
      <main className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src={whiteLogo}
              alt="Logo"
              className="h-12 filter brightness-0 invert"
            />
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} autoComplete="on" className="space-y-6">
                <div className="text-center">
                  <h5 className="text-2xl font-semibold text-gray-800">Register</h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Create your account to get started.
                  </p>
                </div>

                {/* Grid Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                  />
                  <InputField
                    label="E-Mail"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={emailError}
                  />
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>

                <InputField
                  label="Confirm Password"
                  name="password_confirmation"
                  type="password"
                  value={form.password_confirmation}
                  onChange={handleChange}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg text-white shadow-md text-base font-medium transition ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                  }`}
                >
                  {loading ? "Registering..." : "Register"}
                </button>

                <div className="text-center text-sm text-gray-600 pt-4">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white bg-opacity-90 py-4 border-t border-gray-200">
        <div className="flex justify-center space-x-4">
          <Link to="/legal" className="text-sm text-gray-600 hover:text-gray-900">
            Legal
          </Link>
          <span className="text-sm text-gray-600">|</span>
          <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, type = "text", error }) => (
  <div className="space-y-1">
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`peer w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
        }`}
        placeholder=" "
      />
      <label
        htmlFor={name}
        className={`absolute left-4 top-3 px-1 bg-white transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:-translate-y-1/2 ${
          value || error ? "top-0 text-xs transform -translate-y-1/2" : ""
        } ${error ? "text-red-500" : "text-gray-500 peer-focus:text-blue-500"}`}
      >
        {label}
      </label>
    </div>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default RegisterForm;
