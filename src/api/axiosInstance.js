import axios from "axios";

const BASE_URL = "https://app.moovymed.de/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/x-www-form-urlencoded",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Request interceptor: attach access token & locale
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const language = localStorage.getItem("language") || "en";

  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["X-Locale"] = language;

  return config;
});

// Response interceptor: refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        const res = await axios.post(
          `${BASE_URL}/user/refresh`,
          {}, // refresh API has empty body
          {
            headers: {
              Accept: "application/x-www-form-urlencoded",
              "X-Requested-With": "XMLHttpRequest",
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newToken = res.data.access_token;
        localStorage.setItem("token", newToken);

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
