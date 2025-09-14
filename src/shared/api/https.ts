// src/shared/api/http.ts
import { clearAccessToken, getAccessToken, setAccessToken } from "@/shared/auth/token";
import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosRequestHeaders,
  type InternalAxiosRequestConfig,
} from "axios";

const DEBUG_HTTP = true;

const BASE_URL = "/api";
const LOGIN_PATH = "/auth/login";
const REFRESH_PATH = "/auth/refresh";

// * App Config 타입
export interface AppRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // refresh 시도 여부
  _skipAuth?: boolean; // 특정 요청에서 인증 건너뛰기
  _hadAuth?: boolean; // 토큰을 실제로 부착했는지
}

// * Axios 인스턴스 생성
export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

// * Authorization 헤더 세팅
function setAuthHeader(c: AppRequestConfig, token: string) {
  const headers =
    c.headers instanceof AxiosHeaders
      ? c.headers
      : new AxiosHeaders(c.headers as AxiosRequestHeaders | undefined);
  headers.set("Authorization", `Bearer ${token}`);
  c.headers = headers;
  c._hadAuth = true;
}

// -----------------------------
// 요청 인터셉터
// -----------------------------
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const c = config as AppRequestConfig;

  // 토큰 부착이 필요 없는 경우
  if (c._skipAuth) return c;

  // 로그인/리프레시 요청은 토큰 불필요
  const url = c.url ?? "";
  if (url.endsWith(LOGIN_PATH) || url.endsWith(REFRESH_PATH)) return c;

  // AccessToken 붙이기
  const token = getAccessToken();
  if (token) setAuthHeader(c, token);

  return c;
});

// ✅ 디버그용 요청 로거
if (DEBUG_HTTP) {
  http.interceptors.request.use((config) => {
    const auth =
      config.headers instanceof AxiosHeaders
        ? config.headers.get("Authorization")
        : (config.headers as any)?.Authorization;

    console.log(
      `%c[HTTP:REQ] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      "color:#4F46E5;font-weight:bold;",
      {
        params: config.params,
        data: config.data,
        hadAuth: (config as any)._hadAuth,
        authHeader: auth,
        skipAuth: (config as any)._skipAuth,
      },
    );
    return config;
  });
}

// -----------------------------
// 에러 처리 & refresh 로직
// -----------------------------
let isRefreshing = false;
let waiters: Array<() => void> = [];
let forcedLogout = false;

function isAuthError(status?: number) {
  return status === 401 || status === 419 || status === 440 || status === 498;
}

function goLoginOnce() {
  if (forcedLogout) return;
  forcedLogout = true;
  clearAccessToken();
  // window.location.replace("/login");
}

// refresh API 호출 (인터셉터 영향 없음)
async function refreshAccessToken() {
  const { data } = await axios.post<{ accessToken: string }>(BASE_URL + REFRESH_PATH, null, {
    withCredentials: true,
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
  return data.accessToken;
}

// -----------------------------
// 응답 인터셉터
// -----------------------------
http.interceptors.response.use(
  (res) => {
    if (DEBUG_HTTP) {
      console.log(
        `%c[HTTP:RES] ${res.config.method?.toUpperCase()} ${res.config.baseURL}${res.config.url} -> ${res.status}`,
        "color:#16A34A;font-weight:bold;",
        { data: res.data },
      );
    }
    return res;
  },
  async (err: AxiosError) => {
    if (DEBUG_HTTP) {
      console.log(
        "%c[HTTP:ERR]",
        "color:#DC2626;font-weight:bold;",
        err.response?.status,
        err.config?.url,
        {
          hadAuth: (err.config as any)?._hadAuth,
          retry: (err.config as any)?._retry,
        },
      );
    }

    const original = err.config as AppRequestConfig | undefined;

    if (!original || original._retry || !isAuthError(err.response?.status) || !original._hadAuth) {
      throw err;
    }

    // refresh API 자체가 실패한 경우 → 무한루프 방지
    const url = original.url ?? "";
    if (url.endsWith(REFRESH_PATH)) {
      goLoginOnce();
      throw err;
    }

    original._retry = true;

    if (isRefreshing) {
      // 다른 요청이 refresh 중이면 대기
      await new Promise<void>((ok) => waiters.push(ok));
      const t = getAccessToken();
      if (!t) {
        goLoginOnce();
        throw err;
      }
      setAuthHeader(original, t);
      return http(original);
    }

    try {
      // refresh 최초 실행
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      if (!newToken) {
        goLoginOnce();
        throw err;
      }
      setAccessToken(newToken);

      // 대기중인 요청 모두 깨우기
      waiters.forEach((ok) => ok());
      waiters = [];

      setAuthHeader(original, newToken);
      return http(original);
    } catch (e) {
      clearAccessToken();
      waiters = [];
      goLoginOnce();
      throw e;
    } finally {
      isRefreshing = false;
    }
  },
);
