import React, { useEffect, useState } from "react";
import axios from "axios";

const UserGreeting = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://app.moovymed.de/api/v1/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.data);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };
    fetchProfile();
  }, []);

  if (!user) return null;

  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-semibold text-white">Hello, {user.name}</h2>
      <p className="text-gray-100 mt-2">Welcome back!</p>
    </div>
  );
};

export default UserGreeting;
