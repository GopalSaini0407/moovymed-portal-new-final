import React from "react";
import DashboardNavbar from "../components/navbar/DashboardNavbar";

const MainLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, rgba(79, 177, 231, 1) 0%, rgba(255, 0, 117, 1) 100%)",
      }}
    >
      {/* Navbar */}
      <DashboardNavbar />

      {/* Page Content */}
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
};

export default MainLayout;
