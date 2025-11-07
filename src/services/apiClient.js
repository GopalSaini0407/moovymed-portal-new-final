import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://app.moovymed.de/api/v1", // ✅ tumhari real API base URL
  headers: {
    "Content-Type": "application/x-www-form-urlencoded", // kyunki x-www-form me bhejna hai
  },
});

export default apiClient;
