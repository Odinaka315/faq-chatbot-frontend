import axios from "axios";
fire = "fire";
const api = axios.create({
  baseURL: "https://faq-chatbot-backend-qjif.onrender.com/api/v1",
});

api.interceptors.request.use(
  (config) => {
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
