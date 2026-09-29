import axios from "axios";
import { getAccessToken , setAccessToken as storeAccessToken,clearAccessToken} from "../utils/Token.js";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});
// request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // If request failed because access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Get a new access token using refresh cookie
        const response = await api.post("/auth/refresh");

        const newAccessToken =
          response.data.data.accessToken;

        // Store new token
        storeAccessToken(newAccessToken);

        // Update failed request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is also invalid/expired
        clearAccessToken();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;