import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSettings,
  FiSearch,
  FiLogOut,
  FiMessageSquare,
  FiMenu,
  FiX,
} from "react-icons/fi";
import FeedbackButton from "../feedback/FeedbackButton";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchModal from "../../components/SearchModal";
import LogoMain from "../../assets/LogoMain.svg";
import api from "../../api/axiosInstance";
import { useLanguage } from "../../hooks/useLanguage";

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const language = useLanguage();

  // ✅ Logout function
  const handleLogout = async () => {
    try {
      await api.get("/user/logout",{
        headers: {
          "X-Locale": language,
        },
      }); // Logout API call
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("expires_in");
      localStorage.removeItem("token_type");
      localStorage.removeItem("user"); // optional
      navigate("/login");
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <img src={LogoMain} alt="Logo" className="h-12" />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-full transition cursor-pointer">
                <FiMessageSquare className="w-5 h-5 mr-2" />
                <FeedbackButton />
              </div>

              <button
                onClick={() => navigate("/settings")}
                className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
              >
                <FiSettings className="w-5 h-5 mr-2" />
                Settings
              </button>

              <span
                onClick={() => setShowSearchModal(true)}
                className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-full transition cursor-pointer"
              >
                <FiSearch className="w-5 h-5 mr-2" />
                Search
              </span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
              >
                <FiLogOut className="w-5 h-5 mr-2" />
                Logout
              </button>

              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-blue-600 focus:outline-none"
              >
                {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute right-4 mt-2 w-56 rounded-xl p-4 space-y-3 z-50">
            <div
              onClick={() => setShowSearchModal(true)}
              className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
            >
              <FiSearch className="w-5 h-5 mr-2" />
              Search
            </div>

            <div className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
              <FiMessageSquare className="w-5 h-5 mr-2" />
              <FeedbackButton />
            </div>

            <button
              onClick={() => navigate("/settings")}
              className="flex items-center w-full px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <FiSettings className="w-5 h-5 mr-2" />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <FiLogOut className="w-5 h-5 mr-2" />
              Logout
            </button>

            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </>
  );
}
