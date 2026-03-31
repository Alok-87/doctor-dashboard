const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v4`;
import axios from "axios";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("dvbAuthToken");
    
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }

    // 🔥 FIX: Redirect root-level endpoints (/upload, /payment, /leegality)
    const rootURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (config.url && (config.url.startsWith('/payment') || config.url.startsWith('/leegality') || config.url.startsWith('/upload'))) {
      config.baseURL = rootURL; 
    } else {
      config.baseURL = `${rootURL}/api/v4`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
