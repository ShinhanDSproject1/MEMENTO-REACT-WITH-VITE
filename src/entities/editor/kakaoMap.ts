declare global {
  interface Window {
    kakao: any;
  }
}

import axios, { AxiosError } from "axios";
import { getAccessToken, setAccessToken } from "@/shared/auth/token";

export type MentosItem = {
  mentosSeq?: number | string;
  mentosTitle: string;
  price?: number | string;
};

export type MentorItem = {
  mentoName?: string;
  mentoProfileContent?: string;
  mentoProfileImage?: string;
  latitude?: number | string;
  longitude?: number | string;
  distance?: number | string;
  mentosList?: MentosItem[];
};

const API_HOST = import.meta.env.DEV ? "/api" : "https://memento.shinhanacademy.co.kr";
const SAME_ORIGIN = API_HOST.startsWith("/");

const NEARBY_ENDPOINT = (lat: number, lon: number, distanceKm: number) =>
  `${API_HOST}/map/mentos?latitude=${lon}&longitude=${lat}&distance=${distanceKm}`;

const BASE_IMAGE_PATH = "/uploads/";
const FALLBACK_IMAGE = "/static/images/default-60.png";
const BLUE_DOT = "/images/location.svg";
const RED_PIN = "/images/location2.svg";

// 토큰 유효성 검사 함수
function isTokenValid(token: string): boolean {
  try {
    if (!token) return false;

    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    const isValid = payload.exp > now;

    return isValid;
  } catch (error) {
    console.error("[DEBUG] Token validation error:", error);
    return false;
  }
}

// 토큰 갱신 함수
async function refreshToken(): Promise<string | null> {
  try {
    const refreshResponse = await axios.post(
      `${API_HOST}/auth/reissue`,
      {},
      {
        timeout: 10000,
        withCredentials: SAME_ORIGIN,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (refreshResponse.data?.accessToken) {
      return refreshResponse.data.accessToken;
    }

    return null;
  } catch (error) {
    console.error("[DEBUG] 토큰 갱신 실패:", {
      status: (error as AxiosError).response?.status,
      statusText: (error as AxiosError).response?.statusText,
      data: (error as AxiosError).response?.data,
      message: (error as AxiosError).message,
    });
    return null;
  }
}

const apiClient = axios.create({
  timeout: 10000,
  withCredentials: SAME_ORIGIN,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  async (cfg) => {
    let token = getAccessToken?.();
    if (token) {
      const isValid = isTokenValid(token);

      if (!isValid) {
        const newToken = await refreshToken();

        if (newToken) {
          token = newToken;
          setAccessToken(newToken);
        } else {
          token = null;
        }
      }
    }

    if (token) {
      cfg.headers = cfg.headers || {};
      (cfg.headers as any).Authorization = `Bearer ${token}`;
    } else {
      console.log("[DEBUG] 토큰 없이 요청");
    }

    return cfg;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    const isHtmlResponse =
      typeof response.data === "string" && response.data.includes("<!doctype html>");
    const contentType = response.headers["content-type"] || "";
    if (isHtmlResponse || contentType.includes("text/html")) {
      const authError = new Error("Authentication failed - received HTML instead of JSON");
      authError.name = "AuthenticationError";
      (authError as any).isAuthError = true;
      throw authError;
    }

    return response;
  },
  async (error: AxiosError) => {
    const isAuthError =
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      (error as any).isAuthError;

    if (isAuthError && error.config && !(error.config as any)._retry) {
      (error.config as any)._retry = true;

      const newToken = await refreshToken();
      if (newToken && error.config.headers) {
        setAccessToken(newToken);
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(error.config);
      } else {
        console.error("[DEBUG] 토큰 갱신 실패, 로그인 필요");
      }
    }

    return Promise.reject(error);
  },
);

let kakaoLoaderPromise: Promise<void> | null = null;

async function ensureKakaoSdkLoaded(): Promise<void> {
  if (typeof window !== "undefined" && window.kakao?.maps) {
    return;
  }

  if (kakaoLoaderPromise) {
    await kakaoLoaderPromise;
    return;
  }

  kakaoLoaderPromise = (async () => {
    try {
      const apiKey = import.meta.env.VITE_KAKAO_JS_KEY;

      if (!apiKey) {
        throw new Error(
          "Kakao Maps API key is not configured. Please check VITE_KAKAO_JS_KEY in .env.local",
        );
      }

      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        const scriptSrc = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
        script.src = scriptSrc;
        script.async = true;

        script.onload = () => {
          try {
            console.log("[DEBUG] window.kakao 체크:", {
              hasKakao: !!window.kakao,
              hasMaps: !!window.kakao?.maps,
              kakaoKeys: window.kakao ? Object.keys(window.kakao) : [],
            });

            window.kakao.maps.load(() => {
              resolve();
            });
          } catch (e) {
            reject(e);
          }
        };
        script.onerror = (e) => {
          console.error("[DEBUG] Kakao SDK 스크립트 로드 실패:", e);
          reject(new Error("Failed to load Kakao SDK"));
        };
        document.head.appendChild(script);
      });
    } catch (error) {
      console.error("[DEBUG] ensureKakaoSdkLoaded 오류:", error);
      throw error;
    }
  })();

  await kakaoLoaderPromise;
}

function ensureIwStylesInjected() {
  if (document.getElementById("memento-iw-style")) {
    return;
  }

  const css = `
  .memento-iw-root {
    opacity: 0;
    transform: translateY(6px) scale(.98);
    transition: opacity .2s ease, transform .25s ease;
  }
  .memento-iw-root.show {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  .memento-iw-root.hide {
    opacity: 0;
    transform: translateY(6px) scale(.98);
  }
  `;
  const style = document.createElement("style");
  style.id = "memento-iw-style";
  style.textContent = css;
  document.head.appendChild(style);
}

function toNumber(n: unknown): number | null {
  const v = Number(n);
  const result = Number.isNaN(v) ? null : v;
  return result;
}

function buildInfoHtml(mentor: MentorItem) {
  const mentosList = Array.isArray(mentor.mentosList) ? mentor.mentosList : [];
  const priceChip = (price: number | string) => {
    const n = Number(price ?? 0);
    const txt = isFinite(n) ? n.toLocaleString() : String(price ?? "");
    return `${txt}<span style="white-space:nowrap">원</span>`;
  };

  const profileImgSrc = mentor.mentoProfileImage
    ? String(mentor.mentoProfileImage).startsWith("http")
      ? (mentor.mentoProfileImage as string)
      : BASE_IMAGE_PATH + mentor.mentoProfileImage
    : FALLBACK_IMAGE;

  const distanceText =
    typeof mentor.distance === "number"
      ? mentor.distance.toFixed(2)
      : mentor.distance
        ? Number(mentor.distance).toFixed(2)
        : "-";

  const itemsHtml =
    mentosList.length > 0
      ? mentosList
          .map(
            (m) => `
            <li
              class="memento-iw-item"
              data-mentos-id="${m.mentosSeq ?? ""}" 
              style="
                display:flex;align-items:center;justify-content:space-between;gap:12px;
                padding:10px 14px;margin:8px 0 0 0;
                background:#F4F6FA;border:1px solid #E6EAF2;border-radius:12px;
                scroll-snap-align:start;     
              ">
                <span style="
                  flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;
                  color:#1F2937;font-weight:500;
                ">${m.mentosTitle ?? ""}</span>
                <span style="flex:0 0 auto;color:#0B63F6;font-weight:700;white-space:nowrap;">
                  ${priceChip(m.price ?? 0)}
                </span>
              </li>`,
          )
          .join("")
      : `<li style="
            margin-top:8px;padding:12px;border:1px dashed #CDD5E1;border-radius:12px;
            text-align:center;color:#6B7280;background:#FAFBFF;
          ">등록된 멘토링이 없습니다.</li>`;

  const html = `
  <div class="font-WooridaumR memento-iw-root" style="
    width: 250px; max-width: 80vw;
    font-size:14px; line-height:1.55; word-break:keep-all;
    background:#fff; overflow:hidden;
    border: none; box-shadow: 0 6px 18px rgba(16,24,40,.08); ">
      <button id="memento-iw-close" style=" position:absolute; top:13px; right:8px;
      border:none; background:transparent; color:#111; font-size:18px; font-weight:bold; line-height:1; cursor:pointer;">&times;</button>
    <div style="height:6px;background:#0B63F6;"></div>
    <div style="display:flex;align-items:center;gap:12px;padding:14px 16px 8px 16px;">
      <div style="position:relative;">
        <img src="${profileImgSrc}"
              style="width:54px;height:54px;border-radius:50%;object-fit:cover;
                 border:2px solid #0B63F6;background:#fff;" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'" />
      </div>
      <div style="min-width:0;flex:1;">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <h3 class="font-WooridaumB"
              style="margin:0;font-size:15px;color:#111;
                     overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${mentor.mentoName ?? ""}
          </h3>
          <span class="font-WooridaumL" style="display:inline-block;padding:4px 8px;border-radius:999px; background:#0B63F6;color:#fff;font-size:12px;">
            ${distanceText} km </span>
        </div>
        <p class="font-WooridaumR" style="margin:4px 0 0 0;color:#6B7280;font-size:12px; overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          ${mentor.mentoProfileContent ?? ""} </p>
      </div>
    </div>
    <div style="height:1px;background:#EEF2F7;margin:10px 16px;"></div>
    <div style="display:flex;align-items:center;gap:8px;padding:0 16px;">
      <span style="font-size:12px;"></span>
      <h4 class="font-WooridaumB"
          style="margin:6px 0 8px 0;font-size:14px;color:#374151;">
        진행 중인 멘토링
      </h4>
    </div>
    <ul class="font-WooridaumR" style="
      list-style:none;
      padding:0 16px 14px 16px;
      margin:0;
      font-size:12px;
      max-height:150px;
      overflow-y:auto;
      overscroll-behavior:contain;
      -webkit-overflow-scrolling:touch;  
      scroll-snap-type:y mandatory;     
      -webkit-mask-image: linear-gradient(to bottom,
        transparent 0, rgba(0,0,0,.95) 10px,
        #000 calc(100% - 10px), transparent 100%);
              mask-image: linear-gradient(to bottom,
        transparent 0, rgba(0,0,0,.95) 10px,
        #000 calc(100% - 10px), transparent 100%);
    ">
      ${itemsHtml}
    </ul>
  </div>
`;
  return html;
}

export class KakaoMapController {
  private mapEl: HTMLDivElement;
  private map: any | null = null;
  private infoWindow: any | null = null;
  private myMarker: any | null = null;
  private mentorMarkers: any[] = [];

  constructor(mapEl: HTMLDivElement) {
    this.mapEl = mapEl;
  }

  relayout(preserveCenter: boolean = true) {
    if (!this.map) return;
    const center = preserveCenter ? this.map.getCenter() : null;
    try {
      this.map.relayout();
      if (center) this.map.setCenter(center);
    } catch (e) {
      console.warn("[DEBUG] relayout() 실패:", e);
    }
  }

  async init(centerLat = 37.5665, centerLng = 126.978, level = 7) {
    try {
      await ensureKakaoSdkLoaded();

      if (!window.kakao?.maps) {
        throw new Error("Kakao Maps is not available");
      }
      const kakao = window.kakao;
      const center = new kakao.maps.LatLng(centerLat, centerLng);
      console.log("[DEBUG] 지도 센터 좌표 생성:", {
        lat: center.getLat(),
        lng: center.getLng(),
      });

      this.map = new kakao.maps.Map(this.mapEl, {
        center,
        level,
        draggable: true,
        scrollwheel: true,
        disableDoubleClick: false,
      });

      this.infoWindow = new kakao.maps.InfoWindow({ removable: false });
    } catch (error) {
      console.error("[DEBUG] Failed to initialize Kakao Map:", error);
      throw error;
    }
  }

  destroy() {
    this.clearMentors();
    if (this.myMarker) {
      this.myMarker.setMap(null);
      this.myMarker = null;
    }
    this.infoWindow = null;
    this.map = null;
  }

  getCenter(): { lat: number; lng: number } | null {
    if (!this.map) {
      return null;
    }
    const c = this.map.getCenter();
    const result = { lat: c.getLat(), lng: c.getLng() };
    return result;
  }

  moveTo(lat: number, lng: number, level?: number) {
    if (!this.map) {
      return;
    }
    const kakao = window.kakao;
    const pos = new kakao.maps.LatLng(lat, lng);
    this.map.setCenter(pos);
    if (typeof level === "number") this.map.setLevel(level);
  }

  setMyLocation(lat: number, lng: number, opts?: { preserveView?: boolean }) {
    if (!this.map) {
      return;
    }

    const kakao = window.kakao;
    const pos = new kakao.maps.LatLng(lat, lng);
    const preserveView = !!opts?.preserveView;

    if (this.myMarker) {
      this.myMarker.setMap(null);
    }

    const img = new kakao.maps.MarkerImage(BLUE_DOT, new kakao.maps.Size(32, 32), {
      offset: new kakao.maps.Point(16, 32),
    });

    this.myMarker = new kakao.maps.Marker({
      map: this.map,
      position: pos,
      title: "내 위치",
      image: img,
    });

    if (!preserveView) {
      this.map.setCenter(pos);
      this.map.setLevel(5);
    }
  }

  clearMentors() {
    this.mentorMarkers.forEach((m) => m.setMap(null));
    this.mentorMarkers = [];
  }

  async showMentors(
    lat: number,
    lng: number,
    distanceKm = 10,
    keepCurrentView = true,
  ): Promise<number> {
    if (!this.map) {
      throw new Error("Map is not initialized");
    }

    let data: any;

    try {
      const url = NEARBY_ENDPOINT(lat, lng, distanceKm);

      const response = await apiClient.get(url);
      data = response.data;
    } catch (error) {
      const err = error as AxiosError;

      // 인증 실패 체크
      if ((err as any).isAuthError || err.name === "AuthenticationError") {
        console.error("[DEBUG] 토큰 상태 재확인:", {
          hasGetAccessTokenFunc: typeof getAccessToken === "function",
          currentToken: getAccessToken?.()?.substring(0, 20) + "...",
          tokenLength: getAccessToken?.()?.length || 0,
        });
      }

      this.clearMentors();
      throw error;
    }

    if (!(data && data.code === 1000 && Array.isArray(data.result))) {
      this.clearMentors();
      return 0;
    }

    if (data.result.length === 0) {
      return 0;
    }

    const kakao = window.kakao;
    this.clearMentors();
    const bounds = new kakao.maps.LatLngBounds();

    const img = new kakao.maps.MarkerImage(RED_PIN, new kakao.maps.Size(32, 32), {
      offset: new kakao.maps.Point(10, 32),
    });
    let markerCount = 0;

    (data.result as MentorItem[]).forEach((mentor, index) => {
      let latNum = toNumber(mentor.longitude);
      let lngNum = toNumber(mentor.latitude);
      if (latNum !== null && lngNum !== null && (Math.abs(latNum) > 90 || Math.abs(lngNum) > 180)) {
        const t = latNum;
        latNum = lngNum;
        lngNum = t;
      }

      if (latNum === null || lngNum === null) {
        return;
      }
      const pos = new kakao.maps.LatLng(latNum, lngNum);
      const marker = new kakao.maps.Marker({
        map: this.map,
        position: pos,
        title: mentor.mentoName ?? "멘토",
        image: img,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        try {
          const infoHtml = buildInfoHtml(mentor);
          this.infoWindow?.setContent(infoHtml);
          this.infoWindow?.open(this.map, marker);

          setTimeout(() => {
            ensureIwStylesInjected();
            const root = document.querySelector(".memento-iw-root") as HTMLElement | null;

            if (root) requestAnimationFrame(() => root.classList.add("show"));

            root?.querySelectorAll<HTMLLIElement>(".memento-iw-item").forEach((el) => {
              el.addEventListener("click", () => {
                const id = el.dataset.mentosId;
                if (id) {
                  window.location.href = `/menti/mentos-detail/${id}`;
                }
              });
            });

            // 닫기 버튼 처리
            const btn = document.getElementById("memento-iw-close");
            if (btn) {
              btn.addEventListener(
                "click",
                (e) => {
                  e.preventDefault();
                  if (root) {
                    root.classList.remove("show");
                    root.classList.add("hide");
                    root.addEventListener(
                      "transitionend",
                      () => {
                        this.infoWindow?.close();
                      },
                      { once: true },
                    );
                  } else {
                    this.infoWindow?.close();
                  }
                },
                { once: true },
              );
            }

            const iwRoot = btn?.closest("div");
            let cur = iwRoot as HTMLElement | null;
            for (let i = 0; i < 6 && cur; i++) {
              const st = cur.style?.cssText || "";
              if (st.includes("border") || st.includes("box-shadow") || st.includes("boxShadow")) {
                cur.style.border = "none";
                cur.style.boxShadow = "none";
              }
              cur = cur.parentElement as HTMLElement | null;
            }
          }, 0);
        } catch (error) {
          console.error(`[DEBUG] InfoWindow 처리 중 오류:`, error);
        }
      });

      this.mentorMarkers.push(marker);
      bounds.extend(pos);
      markerCount++;
    });
    if (!keepCurrentView && markerCount > 0) {
      try {
        if (markerCount > 1) {
          this.map.setBounds(bounds);
        } else if (markerCount === 1) {
          this.map.setCenter(bounds.getCenter());
          this.map.setLevel(5);
        }
      } catch (e) {
        console.warn("[DEBUG] 지도 범위 조정 오류:", e);
      }
    }

    return markerCount;
  }
}
