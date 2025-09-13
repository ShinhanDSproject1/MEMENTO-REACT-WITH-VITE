// src/shared/api/http.ts
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/shared/auth/token";

type InternalConfig = AxiosRequestConfig & { _retry?: boolean; _skipAuth?: boolean };

// ✅ baseURL 직접 하드코딩
const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  (import.meta.env.DEV ? "/api" : "https://memento.shinhanacademy.co.kr/api");
const REFRESH_PATH = "/auth/refresh";

export const http = axios.create({
  baseURL: BASE_URL.replace(/\/+$/, ""),

  withCredentials: true,
  timeout: 15_000,
});

// 요청 인터셉터 (토큰 주입, _skipAuth 예외)
http.interceptors.request.use((config: InternalConfig) => {
  if (config._skipAuth) return config;
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 응답 시 refresh → 재시도
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

async function refreshAccessToken() {
  const { data } = await axios.post<{ accessToken: string }>(BASE_URL + REFRESH_PATH, null, {
    withCredentials: true,
  });
  return data.accessToken;
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalConfig;
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;

      if (isRefreshing) {
        await new Promise<void>((resolve) => pendingQueue.push(resolve));
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${getAccessToken()}`;
        return http(original);
      }

      try {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        setAccessToken(newToken);
        pendingQueue.forEach((cb) => cb());
        pendingQueue = [];
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return http(original);
      } catch (e) {
        clearAccessToken();
        pendingQueue = [];
        throw e;
      } finally {
        isRefreshing = false;
      }
    }
    throw error;
  },
);
