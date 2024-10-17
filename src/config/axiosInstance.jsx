import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, 
});

console.log("axiosInterceptor");
axiosInstance.interceptors.response.use(
  (res) => {
    console.log(res, "axios");
    return res;
  },
  (err) => {
    if (err.response && err.response.status === 401) {
      console.log("Error Occurred");
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
