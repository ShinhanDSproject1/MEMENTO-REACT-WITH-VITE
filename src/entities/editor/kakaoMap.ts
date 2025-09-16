declare global {
  interface Window {
    kakao: any;
  }
}

export type MentosItem = { mentosTitle: string; price?: number | string };
export type MentorItem = {
  mentoName?: string;
  mentoProfileContent?: string;
  mentoProfileImage?: string;
  latitude?: number | string;
  longitude?: number | string;
  distance?: number | string;
  mentosList?: MentosItem[];
};

const API_HOST = "https://memento.shinhanacademy.co.kr";
const MAPS_KEY_ENDPOINT = `/api/config/maps-key`;
const NEARBY_ENDPOINT = (lat: number, lon: number, distanceKm: number) =>
  `${API_HOST}/map/mentos?latitude=${lat}&longitude=${lon}&distance=${distanceKm}`;
const BASE_IMAGE_PATH = "/uploads/";
const FALLBACK_IMAGE = "/static/images/default-60.png";

const BLUE_DOT = "/images/location.svg";
const RED_PIN = "/images/location2.svg";

/** SDK 중복 로딩 방지 */
let kakaoLoaderPromise: Promise<void> | null = null;
async function ensureKakaoSdkLoaded(): Promise<void> {
  if (typeof window !== "undefined" && window.kakao?.maps) return;
  if (kakaoLoaderPromise) {
    await kakaoLoaderPromise;
    return;
  }

  kakaoLoaderPromise = (async () => {
    const res = await fetch(MAPS_KEY_ENDPOINT);
    if (!res.ok) throw new Error("Failed to fetch Kakao Maps key");
    const { apiKey } = (await res.json()) as { apiKey: string };
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
      script.async = true;
      script.onload = () => {
        try {
          window.kakao.maps.load(() => resolve());
        } catch (e) {
          reject(e);
        }
      };
      script.onerror = () => reject(new Error("Failed to load Kakao SDK"));
      document.head.appendChild(script);
    });
  })();
  await kakaoLoaderPromise;
}

function toNumber(n: unknown): number | null {
  const v = Number(n);
  return Number.isNaN(v) ? null : v;
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
              <li style="
                display:flex;align-items:center;justify-content:space-between;gap:12px;
                padding:10px 14px;margin:8px 0 0 0;
                background:#F4F6FA;border:1px solid #E6EAF2;border-radius:12px;
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

  return `
  <div class="font-WooridaumR" style="
    width: 250px; max-width: 80vw;
    font-size:14px; line-height:1.55; word-break:keep-all;
    background:#fff; overflow:hidden;
    border: none; box-shadow: 0 6px 18px rgba(16,24,40,.08); ">
      <!-- 커스텀 닫기 버튼 -->
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
              style="margin:0;font-size:18px;color:#111;
                     overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${mentor.mentoName ?? ""}
          </h3>
          <span class="font-WooridaumL" style="display:inline-block;padding:4px 8px;border-radius:999px; background:#0B63F6;color:#fff;font-size:12px;">
            ${distanceText} km </span>
        </div>
        <p class="font-WooridaumR" style="margin:4px 0 0 0;color:#6B7280;font-size:13px; overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          ${mentor.mentoProfileContent ?? ""} </p>
      </div>
    </div>
    <div style="height:1px;background:#EEF2F7;margin:10px 16px;"></div>
    <div style="display:flex;align-items:center;gap:8px;padding:0 16px;">
      <span style="font-size:16px;"></span>
      <!-- 섹션 제목: Bold -->
      <h4 class="font-WooridaumB"
          style="margin:6px 0 8px 0;font-size:14px;color:#374151;">
        진행 중인 멘토링
      </h4>
    </div>
    <ul class="font-WooridaumR" style="list-style:none;padding:0 16px 14px 16px;margin:0;">
      ${itemsHtml}
    </ul>
  </div>
`;
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

  /** SDK 로드 & 기본 지도 초기화 */
  async init(centerLat = 37.5665, centerLng = 126.978, level = 7) {
    await ensureKakaoSdkLoaded();
    const kakao = window.kakao;

    const center = new kakao.maps.LatLng(centerLat, centerLng);
    this.map = new kakao.maps.Map(this.mapEl, { center, level });
    this.infoWindow = new kakao.maps.InfoWindow({ removable: false });
  }

  relayout() {
    if (!this.map) return;
    this.map.relayout();
  }

  /** 페이지 언마운트 등 정리 */
  destroy() {
    this.clearMentors();
    if (this.myMarker) {
      this.myMarker.setMap(null);
      this.myMarker = null;
    }
    this.infoWindow = null;
    this.map = null;
  }

  /** 현재 지도 중심 lat/lng 반환 */
  getCenter(): { lat: number; lng: number } | null {
    if (!this.map) return null;
    const c = this.map.getCenter();
    return { lat: c.getLat(), lng: c.getLng() };
  }

  /** 지도 이동(센터/레벨 선택) */
  moveTo(lat: number, lng: number, level?: number) {
    if (!this.map) return;
    const kakao = window.kakao;
    const pos = new kakao.maps.LatLng(lat, lng);
    this.map.setCenter(pos);
    if (typeof level === "number") this.map.setLevel(level);
  }

  /** 내 위치 표시 + 센터 이동 */
  setMyLocation(lat: number, lng: number, opts?: { preserveView?: boolean }) {
    if (!this.map) return;
    const kakao = window.kakao;
    const pos = new kakao.maps.LatLng(lat, lng);
    const preserveView = !!opts?.preserveView;

    if (this.myMarker) this.myMarker.setMap(null);

    const img = new kakao.maps.MarkerImage(BLUE_DOT, new kakao.maps.Size(32, 32), {
      offset: new kakao.maps.Point(16, 32),
    });

    this.myMarker = new kakao.maps.Marker({
      map: this.map,
      position: pos,
      title: "내 위치",
      image: img,
    });

    // 기존 뷰 유지 옵션이면 지도 이동/축소 금지
    if (!preserveView) {
      this.map.setCenter(pos);
      this.map.setLevel(5);
    }
  }

  /** 멘토 마커 모두 제거 */
  clearMentors() {
    this.mentorMarkers.forEach((m) => m.setMap(null));
    this.mentorMarkers = [];
  }

  /** 주변 멘토 조회 + 마커 표시 (카운트 반환) */
  async showMentors(
    lat: number,
    lng: number,
    distanceKm = 10,
    keepCurrentView = true,
  ): Promise<number> {
    if (!this.map) throw new Error("Map is not initialized");
    const res = await fetch(NEARBY_ENDPOINT(lat, lng, distanceKm));
    const data = await res.json();

    if (!(data && data.code === 1000 && Array.isArray(data.result))) {
      this.clearMentors();
      return 0;
    }

    const kakao = window.kakao;
    this.clearMentors();
    const bounds = new kakao.maps.LatLngBounds();
    const img = new kakao.maps.MarkerImage(RED_PIN, new kakao.maps.Size(32, 32), {
      offset: new kakao.maps.Point(10, 32),
    });

    (data.result as MentorItem[]).forEach((mentor) => {
      const latNum = toNumber(mentor.latitude);
      const lngNum = toNumber(mentor.longitude);
      if (latNum === null || lngNum === null) return;

      const pos = new kakao.maps.LatLng(latNum, lngNum);
      const marker = new kakao.maps.Marker({
        map: this.map,
        position: pos,
        title: mentor.mentoName ?? "멘토",
        image: img,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        this.infoWindow?.setContent(buildInfoHtml(mentor));
        this.infoWindow?.open(this.map, marker);

        setTimeout(() => {
          const btn = document.getElementById("memento-iw-close");
          btn?.addEventListener("click", () => this.infoWindow?.close(), { once: true });
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
      });
      this.mentorMarkers.push(marker);
      bounds.extend(pos);
    });
    if (!keepCurrentView) {
      try {
        if (this.mentorMarkers.length > 1) {
          this.map.setBounds(bounds);
        } else if (this.mentorMarkers.length === 1) {
          this.map.setCenter(bounds.getCenter());
          this.map.setLevel(5);
        }
      } catch (e) {
        console.warn("bounds 적용 중 에러:", e);
      }
    }
    return this.mentorMarkers.length;
  }
}
