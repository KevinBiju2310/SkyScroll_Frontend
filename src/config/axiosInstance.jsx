import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalRequest = err.config;
    if(err.response && err.response.status===401 && !originalRequest._retry){
      originalRequest._retry = true;
      try{
        await axiosInstance.post("/refresh-token");
        return axiosInstance(originalRequest);
      }catch(refreshError){
        console.log("Failed to refresh token", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
