let ACCESS_TOKEN: string | null = null;

export function setAccessToken(token: string | null) {
  ACCESS_TOKEN = token;
}

export function getAccessToken() {
  return ACCESS_TOKEN;
}

export function clearAccessToken() {
  ACCESS_TOKEN = null;
}
