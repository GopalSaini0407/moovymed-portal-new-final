import axios from "axios";

const BASE_URL = "https://app.moovymed.de/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/x-www-form-urlencoded",
    "X-Requested-With": "XMLHttpRequest",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const language = localStorage.getItem("language") || "en";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["X-Locale"] = language;

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   LOGOUT HANDLER
========================= */
const clearAuthAndRedirect = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");

  // SPA safe redirect
  window.location.replace("/login");
};

/* =========================
   RESPONSE INTERCEPTOR
========================= */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");

      // 🔴 No refresh token → logout immediately
      if (!refreshToken) {
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      // 🔁 Prevent multiple refresh calls
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/user/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newToken = res.data.access_token;

        localStorage.setItem("token", newToken);

        api.defaults.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearAuthAndRedirect();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
