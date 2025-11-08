import React from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import LogoMain from "../../assets/LogoMain.svg";

export default function AuthNavbar() {
  return (
    <>
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <img
                  src={LogoMain}
                  alt="Logo"
                  className="h-12"
                />
              </a>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* 👇 Add top padding so content doesn't hide behind navbar */}
      <div className="h-16"></div>
    </>
  );
}
