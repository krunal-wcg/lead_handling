import axios from "axios";

export const Api = axios.create({
  baseURL: "http://192.168.1.107:9000/api",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      localStorage.getItem("token") &&
      `Bearer ${localStorage.getItem("token")}`,
  },
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

Api.interceptors.response.use(
  function (response) {
    // Do something before request is sent
    return response;
  },
  function (error) {
    // Do something with request error
    if (
      error.response.data.title === "Server Error" ||
      error.response.data.title === "Unauthorized"
    ) {
      localStorage.clear();
      window.location.reload();
    }

    return Promise.reject(error);
  }
);
