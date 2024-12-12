import axios from "axios";
import store from "../redux/store";
import { logout, updateUserProfile } from "../redux/userSlice";

const axiosInstance = axios.create({
  baseURL: "https://skyscroll-backend.onrender.com",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalRequest = err.config;
    if (
      err.response &&
      err.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post("/refresh-token");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("Failed to refresh token", refreshError);
        return Promise.reject(refreshError);
      }
    }
    if (err.response?.status === 403) {
      const dispatch = store.dispatch;
      dispatch(updateUserProfile({ isBlocked: true }));
      dispatch(logout());
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
