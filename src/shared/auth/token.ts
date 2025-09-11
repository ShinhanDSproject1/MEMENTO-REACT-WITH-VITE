// src/shared/auth/token.ts
let accessToken: string | null = null;

export const tokenStore = {
  get() {
    return accessToken;
  },
  set(token: string | null) {
    accessToken = token;
    // 필요하다면 sessionStorage 도 병행:
    if (token) sessionStorage.setItem("accessToken", token);
    else sessionStorage.removeItem("accessToken");
  },
  hydrateFromSession() {
    const t = sessionStorage.getItem("accessToken");
    accessToken = t;
    return t;
  },
};
