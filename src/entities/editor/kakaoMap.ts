declare global {
  interface Window {
    kakao: any;
  }
}

import axios, { AxiosError } from "axios";
import { getAccessToken } from "@/shared/auth/token";

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

console.log("[DEBUG] Environment check:", {
  isDev: import.meta.env.DEV,
  API_HOST,
  SAME_ORIGIN,
  userAgent: navigator.userAgent,
  currentUrl: window.location.href,
});

const NEARBY_ENDPOINT = (lat: number, lon: number, distanceKm: number) =>
  `${API_HOST}/map/mentos?latitude=${lon}&longitude=${lat}&distance=${distanceKm}`;

const BASE_IMAGE_PATH = "/uploads/";
const FALLBACK_IMAGE = "/static/images/default-60.png";
const BLUE_DOT = "/images/location.svg";
const RED_PIN = "/images/location2.svg";

const apiClient = axios.create({
  timeout: 10000,
  withCredentials: SAME_ORIGIN,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((cfg) => {
  console.log("[DEBUG] API Request interceptor:", {
    url: cfg.url,
    method: cfg.method,
    headers: cfg.headers,
    withCredentials: cfg.withCredentials,
  });

  const token = getAccessToken?.();
  console.log("[DEBUG] Auth token check:", {
    hasGetAccessTokenFunc: typeof getAccessToken === "function",
    hasToken: !!token,
    tokenLength: token?.length || 0,
  });

  if (token) {
    cfg.headers = cfg.headers || {};
    (cfg.headers as any).Authorization = `Bearer ${token}`;
    console.log("[DEBUG] Authorization header added");
  }
  return cfg;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log("[DEBUG] API Response success:", {
      url: response.config.url,
      status: response.status,
      dataType: typeof response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
      dataCode: response.data?.code,
      resultLength: Array.isArray(response.data?.result)
        ? response.data.result.length
        : "not array",
    });
    return response;
  },
  (error) => {
    console.error("[DEBUG] API Response error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data,
      isNetworkError: error.code === "NETWORK_ERROR",
      isTimeout: error.code === "ECONNABORTED",
    });
    return Promise.reject(error);
  },
);

let kakaoLoaderPromise: Promise<void> | null = null;

async function ensureKakaoSdkLoaded(): Promise<void> {
  console.log("[DEBUG] ensureKakaoSdkLoaded 시작");

  if (typeof window !== "undefined" && window.kakao?.maps) {
    console.log("[DEBUG] Kakao SDK 이미 로드됨");
    return;
  }

  if (kakaoLoaderPromise) {
    console.log("[DEBUG] Kakao SDK 로딩 중... 대기");
    await kakaoLoaderPromise;
    return;
  }

  kakaoLoaderPromise = (async () => {
    try {
      const apiKey = import.meta.env.VITE_KAKAO_JS_KEY;
      console.log("[DEBUG] Kakao API Key 체크:", {
        hasKey: !!apiKey,
        keyLength: apiKey?.length || 0,
        keyPrefix: apiKey ? apiKey.substring(0, 8) + "..." : "none",
      });

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

        console.log("[DEBUG] Kakao SDK 스크립트 로딩 시작:", scriptSrc);

        script.onload = () => {
          console.log("[DEBUG] Kakao SDK 스크립트 로드 완료");
          try {
            console.log("[DEBUG] window.kakao 체크:", {
              hasKakao: !!window.kakao,
              hasMaps: !!window.kakao?.maps,
              kakaoKeys: window.kakao ? Object.keys(window.kakao) : [],
            });

            window.kakao.maps.load(() => {
              console.log("[DEBUG] Kakao Maps 로드 완료");
              resolve();
            });
          } catch (e) {
            console.error("[DEBUG] Kakao Maps 로드 중 오류:", e);
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
  console.log("[DEBUG] Kakao SDK 로드 완료");
}

function ensureIwStylesInjected() {
  console.log("[DEBUG] ensureIwStylesInjected 호출");
  if (document.getElementById("memento-iw-style")) {
    console.log("[DEBUG] InfoWindow 스타일 이미 주입됨");
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
  console.log("[DEBUG] InfoWindow 스타일 주입 완료");
}

function toNumber(n: unknown): number | null {
  const v = Number(n);
  const result = Number.isNaN(v) ? null : v;
  console.log("[DEBUG] toNumber 변환:", { input: n, output: result });
  return result;
}

function buildInfoHtml(mentor: MentorItem) {
  console.log("[DEBUG] buildInfoHtml 호출:", mentor);

  const mentosList = Array.isArray(mentor.mentosList) ? mentor.mentosList : [];
  console.log("[DEBUG] 멘토링 리스트:", mentosList);

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

  console.log("[DEBUG] 프로필 이미지 경로:", profileImgSrc);

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

  console.log("[DEBUG] InfoWindow HTML 생성 완료, 길이:", html.length);
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
    console.log("[DEBUG] KakaoMapController 생성자:", {
      hasMapEl: !!mapEl,
      mapElId: mapEl?.id,
      mapElClass: mapEl?.className,
    });
  }

  relayout(preserveCenter: boolean = true) {
    console.log("[DEBUG] relayout 호출:", { preserveCenter, hasMap: !!this.map });
    if (!this.map) return;
    const center = preserveCenter ? this.map.getCenter() : null;
    try {
      this.map.relayout();
      if (center) this.map.setCenter(center);
      console.log("[DEBUG] relayout 성공");
    } catch (e) {
      console.warn("[DEBUG] relayout() 실패:", e);
    }
  }

  async init(centerLat = 37.5665, centerLng = 126.978, level = 7) {
    console.log("[DEBUG] Map init 시작:", { centerLat, centerLng, level });

    try {
      await ensureKakaoSdkLoaded();

      if (!window.kakao?.maps) {
        console.error("[DEBUG] Kakao Maps이 사용 불가능");
        throw new Error("Kakao Maps is not available");
      }

      console.log("[DEBUG] Kakao Maps 사용 가능, 지도 생성 중...");
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

      console.log("[DEBUG] 지도 생성 완료");

      this.infoWindow = new kakao.maps.InfoWindow({ removable: false });

      console.log("[DEBUG] InfoWindow 생성 완료");
      console.log("[DEBUG] Map init 성공");
    } catch (error) {
      console.error("[DEBUG] Failed to initialize Kakao Map:", error);
      throw error;
    }
  }

  destroy() {
    console.log("[DEBUG] destroy 호출");
    this.clearMentors();
    if (this.myMarker) {
      this.myMarker.setMap(null);
      this.myMarker = null;
      console.log("[DEBUG] 내 위치 마커 제거");
    }
    this.infoWindow = null;
    this.map = null;
    console.log("[DEBUG] destroy 완료");
  }

  getCenter(): { lat: number; lng: number } | null {
    if (!this.map) {
      console.log("[DEBUG] getCenter: map이 없음");
      return null;
    }
    const c = this.map.getCenter();
    const result = { lat: c.getLat(), lng: c.getLng() };
    console.log("[DEBUG] getCenter:", result);
    return result;
  }

  moveTo(lat: number, lng: number, level?: number) {
    console.log("[DEBUG] moveTo 호출:", { lat, lng, level });
    if (!this.map) {
      console.log("[DEBUG] moveTo: map이 없음");
      return;
    }
    const kakao = window.kakao;
    const pos = new kakao.maps.LatLng(lat, lng);
    this.map.setCenter(pos);
    if (typeof level === "number") this.map.setLevel(level);
    console.log("[DEBUG] moveTo 완료");
  }

  setMyLocation(lat: number, lng: number, opts?: { preserveView?: boolean }) {
    console.log("[DEBUG] setMyLocation 호출:", { lat, lng, opts });

    if (!this.map) {
      console.log("[DEBUG] setMyLocation: map이 없음");
      return;
    }

    const kakao = window.kakao;
    const pos = new kakao.maps.LatLng(lat, lng);
    const preserveView = !!opts?.preserveView;

    if (this.myMarker) {
      this.myMarker.setMap(null);
      console.log("[DEBUG] 기존 내 위치 마커 제거");
    }

    const img = new kakao.maps.MarkerImage(BLUE_DOT, new kakao.maps.Size(32, 32), {
      offset: new kakao.maps.Point(16, 32),
    });

    console.log("[DEBUG] 내 위치 마커 이미지 생성:", BLUE_DOT);

    this.myMarker = new kakao.maps.Marker({
      map: this.map,
      position: pos,
      title: "내 위치",
      image: img,
    });

    console.log("[DEBUG] 내 위치 마커 생성 완료");

    if (!preserveView) {
      this.map.setCenter(pos);
      this.map.setLevel(5);
      console.log("[DEBUG] 지도 중심점 이동");
    }
  }

  clearMentors() {
    console.log("[DEBUG] clearMentors 호출, 기존 마커 수:", this.mentorMarkers.length);
    this.mentorMarkers.forEach((m) => m.setMap(null));
    this.mentorMarkers = [];
    console.log("[DEBUG] 멘토 마커 모두 제거 완료");
  }

  async showMentors(
    lat: number,
    lng: number,
    distanceKm = 10,
    keepCurrentView = true,
  ): Promise<number> {
    console.log("[DEBUG] showMentors 호출:", { lat, lng, distanceKm, keepCurrentView });

    if (!this.map) {
      console.error("[DEBUG] showMentors: map이 초기화되지 않음");
      throw new Error("Map is not initialized");
    }

    let data: any;

    try {
      const url = NEARBY_ENDPOINT(lat, lng, distanceKm);
      console.log("[DEBUG] API 요청 URL:", url);

      const response = await apiClient.get(url);
      data = response.data;
      console.log("[DEBUG] API 응답 받음:", data);
    } catch (error) {
      const err = error as AxiosError;
      console.error("[DEBUG] API 요청 실패:", {
        url: err.config?.url,
        method: err.config?.method,
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: err.message,
        data: err.response?.data,
        isNetworkError: !err.response,
        code: err.code,
      });

      this.clearMentors();
      throw error;
    }

    console.log("[DEBUG] API 응답 분석:", {
      hasData: !!data,
      dataType: typeof data,
      code: data?.code,
      hasResult: !!data?.result,
      resultType: typeof data?.result,
      isResultArray: Array.isArray(data?.result),
      resultLength: Array.isArray(data?.result) ? data.result.length : "not array",
    });

    if (!(data && data.code === 1000 && Array.isArray(data.result))) {
      console.warn("[DEBUG] 예상치 못한 API 응답 형식:", data);
      this.clearMentors();
      return 0;
    }

    if (data.result.length === 0) {
      console.info("[DEBUG] 주변 멘토 없음:", { lat, lng, distanceKm });
      return 0;
    }

    console.log("[DEBUG] 멘토 데이터:", data.result);

    const kakao = window.kakao;
    this.clearMentors();
    const bounds = new kakao.maps.LatLngBounds();

    const img = new kakao.maps.MarkerImage(RED_PIN, new kakao.maps.Size(32, 32), {
      offset: new kakao.maps.Point(10, 32),
    });

    console.log("[DEBUG] 멘토 마커 이미지 생성:", RED_PIN);

    let markerCount = 0;

    (data.result as MentorItem[]).forEach((mentor, index) => {
      console.log(`[DEBUG] 멘토 ${index + 1} 처리 중:`, mentor);

      let latNum = toNumber(mentor.longitude);
      let lngNum = toNumber(mentor.latitude);

      console.log(`[DEBUG] 멘토 ${index + 1} 좌표 변환:`, {
        originalLat: mentor.latitude,
        originalLng: mentor.longitude,
        convertedLat: latNum,
        convertedLng: lngNum,
      });

      if (latNum !== null && lngNum !== null && (Math.abs(latNum) > 90 || Math.abs(lngNum) > 180)) {
        console.log(`[DEBUG] 멘토 ${index + 1} 좌표 순서 바꿈 (lat/lng swap)`);
        const t = latNum;
        latNum = lngNum;
        lngNum = t;
      }

      if (latNum === null || lngNum === null) {
        console.warn(`[DEBUG] 멘토 ${index + 1} 좌표 변환 실패, 스킵:`, { latNum, lngNum });
        return;
      }

      console.log(`[DEBUG] 멘토 ${index + 1} 최종 좌표:`, { lat: latNum, lng: lngNum });

      const pos = new kakao.maps.LatLng(latNum, lngNum);
      const marker = new kakao.maps.Marker({
        map: this.map,
        position: pos,
        title: mentor.mentoName ?? "멘토",
        image: img,
      });

      console.log(`[DEBUG] 멘토 ${index + 1} 마커 생성 완료:`, marker);

      kakao.maps.event.addListener(marker, "click", () => {
        console.log(`[DEBUG] 멘토 ${index + 1} 마커 클릭됨`);

        try {
          const infoHtml = buildInfoHtml(mentor);
          this.infoWindow?.setContent(infoHtml);
          this.infoWindow?.open(this.map, marker);
          console.log(`[DEBUG] InfoWindow 열기 완료`);

          setTimeout(() => {
            ensureIwStylesInjected();
            const root = document.querySelector(".memento-iw-root") as HTMLElement | null;
            console.log(`[DEBUG] InfoWindow root 요소:`, root);

            if (root) requestAnimationFrame(() => root.classList.add("show"));

            root?.querySelectorAll<HTMLLIElement>(".memento-iw-item").forEach((el) => {
              el.addEventListener("click", () => {
                const id = el.dataset.mentosId;
                console.log(`[DEBUG] 멘토링 아이템 클릭:`, id);
                if (id) {
                  window.location.href = `/menti/mentos-detail/${id}`;
                }
              });
            });

            // 닫기 버튼 처리
            const btn = document.getElementById("memento-iw-close");
            console.log(`[DEBUG] 닫기 버튼:`, btn);
            if (btn) {
              btn.addEventListener(
                "click",
                (e) => {
                  console.log(`[DEBUG] InfoWindow 닫기 버튼 클릭`);
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

      console.log(`[DEBUG] 멘토 ${index + 1} 마커 추가 완료, 총 마커 수: ${markerCount}`);
    });

    console.log("[DEBUG] 모든 멘토 마커 처리 완료:", {
      totalMentors: data.result.length,
      createdMarkers: markerCount,
      keepCurrentView,
    });

    if (!keepCurrentView && markerCount > 0) {
      try {
        if (markerCount > 1) {
          console.log("[DEBUG] 여러 마커로 지도 범위 조정");
          this.map.setBounds(bounds);
        } else if (markerCount === 1) {
          console.log("[DEBUG] 단일 마커로 지도 중심 이동");
          this.map.setCenter(bounds.getCenter());
          this.map.setLevel(5);
        }
      } catch (e) {
        console.warn("[DEBUG] 지도 범위 조정 오류:", e);
      }
    }

    console.log(`[DEBUG] showMentors 완료, 반환 마커 수: ${markerCount}`);
    return markerCount;
  }
}
