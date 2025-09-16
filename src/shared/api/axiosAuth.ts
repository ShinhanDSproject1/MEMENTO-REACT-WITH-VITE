// src/shared/api/axiosAuth.ts
import axios from "axios";
import type { AxiosRequestConfig, AxiosError } from "axios";

const BASE: string = import.meta.env.VITE_API_BASE_URL ?? "/api";

// ── 토큰 유틸(간단 버전) ───────────────────────────────────────────
export function getAccessToken() {
  return localStorage.getItem("accessToken");
}
export function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
}
export function clearAccessToken() {
  localStorage.removeItem("accessToken");
}

// ── 공통 axios 호출 ────────────────────────────────────────────────
export async function axiosAuth<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  // 1) 요청 전: Authorization 세팅
  const token = getAccessToken();
  const headers: Record<string, string> = {
    ...(config.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await axios({
      baseURL: BASE,
      withCredentials: true, // refresh 쿠키 전달
      ...config,
      headers,
    });
    return res.data as T;
  } catch (e) {
    const err = e as AxiosError;

    // 2) 401 → refresh 후 재시도
    if (err.response?.status === 401) {
      try {
        const refreshRes = await axios.post<{ accessToken: string }>(`${BASE}/auth/refresh`, null, {
          withCredentials: true,
        });
        const newToken = refreshRes.data.accessToken;
        setAccessToken(newToken);

        const retryHeaders: Record<string, string> = {
          ...(config.headers as Record<string, string> | undefined),
          Authorization: `Bearer ${newToken}`,
        };
        const retryRes = await axios({
          baseURL: BASE,
          withCredentials: true,
          ...config,
          headers: retryHeaders,
        });
        return retryRes.data as T;
      } catch (refreshErr) {
        clearAccessToken();
        throw refreshErr;
      }
    }

    throw err;
  }
}
