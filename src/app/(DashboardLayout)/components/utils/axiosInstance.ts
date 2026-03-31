import axios from 'axios';
// import { logout } from '../app/auth/authSlice';
import type { AppDispatch, RootState } from '../../../../../redux/store/store';

const v4URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v4`;

const axiosInstance = axios.create({
  baseURL: v4URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupAxiosInterceptors = (store: {
  dispatch: AppDispatch;
  getState: () => RootState;
}) => {
  // REQUEST INTERCEPTOR
  axiosInstance.interceptors.request.use(
    (config) => {
      // Use localStorage for token as it's not stored in the Redux auth state
      const token = localStorage.getItem('access_token') || localStorage.getItem('dvbAuthToken');

      // Add token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const rootURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const v4URL = `${rootURL}/api/v4`;
      const v3URL = `${rootURL}/api/v3`;

      // 🔥 IMPORTANT: Route root-level endpoints correctly
      if (config.url && (config.url.startsWith('/payment') || config.url.startsWith('/leegality') || config.url.startsWith('/upload'))) {
        config.baseURL = rootURL;            // No /api/v4 prefix
      } else {
        config.baseURL = v4URL;              // Default to v4 for now, or match your secondary preference
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE INTERCEPTOR
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // store.dispatch(logout());
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;