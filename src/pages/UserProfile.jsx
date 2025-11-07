import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import MainLayout from "../layouts/MainLayout";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Get token from localStorage
  const token = localStorage.getItem("token");

  // Axios instance with token header
  const axiosInstance = axios.create({
    baseURL: "https://app.moovymed.de/api/v1",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // ✅ Fetch user profile (GET)
  const fetchProfile = async () => {
    if (!token) {
      toast.error("No token found! Please login again.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get("/user/profile");

      if (res.data?.data) {
        setProfile({
          name: res.data.data.name || "",
          email: res.data.data.email || "",
        });
      } else {
        toast.error("Invalid profile response.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update profile (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.name) {
      toast.warning("Please enter your name!");
      return;
    }

    setSaving(true);
    try {
      const res = await axiosInstance.post("/user/profile", {
        email: profile.email,
        name: profile.name,
      });

      if (res.data?.message) {
        toast.success(res.data.message);
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <MainLayout>
 <div className="max-w-3xl mx-auto p-6 rounded-2xl"
    style={{
      backdropFilter: "blur(20px)",
      backgroundColor: "rgba(255, 255, 255, 0.75)",
    }}
    >
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-900">User Profile</h2>
        <p className="text-gray-600 mt-1">Manage your profile</p>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading profile...</div>
      ) : (
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          className=" p-6 rounded-xl"
        >
          {/* Email Field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={profile.email}
              readOnly
              className="w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-md px-3 py-2 focus:outline-none"
            />
          </div>

          {/* Name Field */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm border-gray-300 font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={profile.name}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center justify-center gap-2 border border-indigo-500 text-indigo-600 px-5 py-2 rounded-md text-sm font-semibold transition ${
              saving
                ? "bg-indigo-100 cursor-not-allowed"
                : "hover:bg-indigo-50"
            }`}
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 
                    0 5.373 0 12h4z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FaCheck /> Save
              </>
            )}
          </button>
        </form>
      )}
    </div>
    </MainLayout>
   
  );
}
