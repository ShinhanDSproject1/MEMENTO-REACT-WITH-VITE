// src/shared/api/http.ts
import { clearAccessToken, getAccessToken, setAccessToken } from "@/shared/auth/token";
import axios, {
  AxiosHeaders,
  type AxiosRequestHeaders,
  type InternalAxiosRequestConfig,
} from "axios";

const DEBUG_HTTP = true;

// const BASE_URL = "https://memento.shinhanacademy.co.kr/api";
const BASE_URL = "/api";
const LOGIN_PATH = "/auth/login";
const REFRESH_PATH = "/auth/reissue";

export interface AppRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // 이 요청이 리프레시 이후 재시도된 것인지
  _skipAuth?: boolean; // 인증 건너뛰기 플래그
  _hadAuth?: boolean; // 실제로 Authorization 헤더를 붙였는지
}

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // RT 쿠키 포함
  timeout: 15_000,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

/** Authorization 헤더 부착 + 표식 */
function setAuthHeader(c: AppRequestConfig, token: string) {
  const headers =
    c.headers instanceof AxiosHeaders
      ? c.headers
      : new AxiosHeaders(c.headers as AxiosRequestHeaders | undefined);
  headers.set("Authorization", `Bearer ${token}`);
  c.headers = headers;
  c._hadAuth = true;
}

/* ------------------------ 디버그 로깅 (단 1회 등록) ------------------------ */
if (DEBUG_HTTP) {
  interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _hadAuth?: boolean;
    _skipAuth?: boolean;
  }

  http.interceptors.request.use((config: CustomAxiosRequestConfig) => {
    const auth =
      config.headers instanceof AxiosHeaders
        ? config.headers.get("Authorization")
        : (config.headers?.["Authorization"] as string | undefined);

    console.log(
      `%c[HTTP:REQ] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      "color:#4F46E5;font-weight:bold;",
      {
        params: config.params,
        data: config.data,
        hadAuth: config._hadAuth,
        authHeader: auth,
        skipAuth: config._skipAuth,
      },
    );
    return config;
  });

  http.interceptors.response.use(
    (res) => {
      console.log(
        `%c[HTTP:RES] ${res.config.method?.toUpperCase()} ${res.config.baseURL}${res.config.url} -> ${res.status}`,
        "color:#16A34A;font-weight:bold;",
        { data: res.data },
      );
      return res;
    },
    (error) => {
      const cfg = error.config as AppRequestConfig | undefined;
      console.log(
        `%c[HTTP:ERR] ${cfg?.method?.toUpperCase()} ${cfg?.baseURL}${cfg?.url} -> ${error.response?.status}`,
        "color:#DC2626;font-weight:bold;",
        { hadAuth: cfg?._hadAuth, retry: cfg?._retry, data: error.response?.data },
      );
      return Promise.reject(error);
    },
  );
}

/* ----------------------------- Request 인터셉터 ----------------------------- */
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const c = config as AppRequestConfig;

  // 인증 스킵
  if (c._skipAuth) return c;

  // 로그인/리프레시는 AT 불필요
  const url = c.url ?? "";
  if (url.startsWith(LOGIN_PATH) || url.startsWith(REFRESH_PATH)) return c;

  // AT 부착
  const token = getAccessToken();
  if (token) setAuthHeader(c, token);

  return c;
});

function isAuthError(status?: number) {
  return status === 401 || status === 419 || status === 440 || status === 498;
}

let refreshPromise: Promise<string> | null = null;

function refreshAccessTokenOnce(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = axios
    .post<{ result?: { accessToken: string } }>(BASE_URL + REFRESH_PATH, null, {
      withCredentials: true,
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
    .then((res) => {
      const t = res.data?.result?.accessToken;
      if (!t) throw new Error("No accessToken");
      setAccessToken(t);
      return t;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

// ✅ 외부(Provider)에서 같은 Promise를 재사용할 수 있게 export
export function refreshSilently() {
  return refreshAccessTokenOnce();
}

http.interceptors.response.use(
  (r) => r,
  async (err) => {
    //리프래시 조건 체크
    const original = err.config as AppRequestConfig | undefined;
    if (!original || original._retry || !isAuthError(err.response?.status) || !original._hadAuth) {
      throw err;
    }

    // 리프레시 API 자체에서 난 에러면 그냥 실패 처리
    if ((original.url ?? "").endsWith(REFRESH_PATH)) {
      clearAccessToken();
      throw err;
    }
    original._retry = true;

    try {
      const newToken = await refreshAccessTokenOnce();

      const headers =
        original.headers instanceof AxiosHeaders
          ? original.headers
          : new AxiosHeaders(original.headers as AxiosRequestHeaders | undefined);
      headers.set("Authorization", `Bearer ${newToken}`);
      original.headers = headers;

      return http(original);
    } catch (e) {
      clearAccessToken();
      throw e;
    }
  },
);
