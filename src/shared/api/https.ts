import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://api.example.com",
  withCredentials: true, // 쿠키 필요하면 true
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // 토큰 만료 시 로그아웃 처리 같은 로직
    if (error.response?.status === 401) {
      console.warn("인증 만료됨");
    }
    return Promise.reject(error);
  },
);
