import React from 'react'
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


export default function Footer() {
    const { t } = useTranslation();

  return (
    <>
      {/* Footer */}
      <footer className=" bg-opacity-90 py-4   mt-3">
    <div className="container mx-auto px-4">
      <div className="flex justify-center space-x-4">
        <Link
          to="/legal-notice"
          className="text-sm text-white transition"
        >
         {t("footer.legal")}
        </Link>
        <span className="text-sm text-white">|</span>
        <Link
          to="/privacy"
          className="text-sm text-white transition"
        >
     {t("footer.privacy")}
          
        </Link>
      </div>
    </div>
  </footer>
    </>
  
    )
}
