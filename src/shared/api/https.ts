// src/shared/api/http.ts
import { clearAccessToken, getAccessToken, setAccessToken } from "@/shared/auth/token";
import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
type Internal = AxiosRequestConfig & { _retry?: boolean; _skipAuth?: boolean };

// ✅ baseURL 직접 하드코딩
// const BASE_URL = "https://memento.shinhanacademy.co.kr/api";
const BASE_URL = "/api";
const REFRESH_PATH = "/auth/refresh";

export interface AppRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _skipAuth?: boolean;
}

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // refresh 쿠키 전송
  timeout: 15000,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const c = config as AppRequestConfig;

  if (c._skipAuth) return c;

  const token = getAccessToken();
  if (token) {
    // ✅ headers를 AxiosHeaders 인스턴스로 보장
    const headers =
      c.headers instanceof AxiosHeaders
        ? c.headers
        : new AxiosHeaders(c.headers as AxiosRequestHeaders | undefined);

    headers.set("Authorization", `Bearer ${token}`);
    c.headers = headers; // ✅ 타입 안전
  }
  return c;
});

// 응답: 401 → refresh 1회 → 재시도
let isRefreshing = false;
let waiters: Array<() => void> = [];

async function refreshAccessToken() {
  const { data } = await axios.post<{ accessToken: string }>(BASE_URL + REFRESH_PATH, null, {
    withCredentials: true,
  });
  return data.accessToken;
}

http.interceptors.response.use(
  (r) => r,
  async (err: AxiosError) => {
    const original = err.config as Internal;
    if (err.response?.status === 401 && !original?._retry) {
      original._retry = true;

      if (isRefreshing) {
        await new Promise<void>((ok) => waiters.push(ok));
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${getAccessToken()}`;
        return http(original);
      }

      try {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        setAccessToken(newToken);
        waiters.forEach((cb) => cb());
        waiters = [];
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return http(original);
      } catch (e) {
        clearAccessToken();
        waiters = [];
        throw e;
      } finally {
        isRefreshing = false;
      }
    }
    throw err;
  },
);
