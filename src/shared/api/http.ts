// 공통 http 클라이언트 (JWT)

import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { tokenStore } from "@/shared/auth/token";

// 기본 클라이언트
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env에서 읽음
  withCredentials: false, // JWT 헤더 방식이면 보통 false
  timeout: 15000,
});

// ==============================
// 요청 인터셉터: JWT 자동 첨부
// ==============================
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.access;
  if (token) {
    // headers 타입을 명시해 Authorization 키를 안전하게 추가
    const headers = (config.headers ||= {} as AxiosRequestHeaders);
    headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==============================
// 401 처리: refresh → 원요청 재시도
// ==============================
let isRefreshing = false;
let pendingQueue: Array<(newAccess: string) => void> = [];

async function refreshToken(): Promise<string> {
  // ⚠️ 백엔드 명세에 맞게 경로/바디/응답 필드 수정해
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
    { refreshToken: tokenStore.refresh },
    { withCredentials: false },
  );
  tokenStore.set(data.accessToken, data.refreshToken);
  return data.accessToken as string;
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccess = await refreshToken();
          // 대기 중이던 요청 이어주기
          pendingQueue.forEach((resume) => resume(newAccess));
          pendingQueue = [];
          isRefreshing = false;

          const headers = (original.headers ||= {} as AxiosRequestHeaders);
          headers.Authorization = `Bearer ${newAccess}`;
          return http(original);
        } catch (e) {
          isRefreshing = false;
          pendingQueue = [];
          tokenStore.clear();
          return Promise.reject(e);
        }
      }

      // 리프레시 진행 중이면 큐에 넣고 새 토큰으로 재시도
      return new Promise((resolve) => {
        pendingQueue.push((newAccess) => {
          const headers = (original.headers ||= {} as AxiosRequestHeaders);
          headers.Authorization = `Bearer ${newAccess}`;
          resolve(http(original));
        });
      });
    }

    return Promise.reject(error);
  },
);
