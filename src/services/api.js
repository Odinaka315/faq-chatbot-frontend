import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

// The Interceptor: Runs automatically before every single request
api.interceptors.request.use(
  (config) => {
    // Grab the latest token straight from the browser's memory
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
