import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Button from "@/widgets/common/Button";
import SnapCarousel from "@/widgets/common/SnapCarousel";
import ReviewMentosDetailCard from "@/widgets/mentos/ReviewMentosDetailCard";
import clockIcon from "@assets/icons/icon-clock.svg";
import locationIcon from "@assets/icons/icon-location.svg";
import starIcon from "@assets/icons/icon-star.svg";
import DOMPurify from "dompurify";
import { KakaoMapController } from "@entities/editor";
import type { MentosDetailResult, ReviewItem } from "@shared/api/mentos";
import { getMentosDetail, getMentosReviewsPage } from "@shared/api/mentos";
import { useAuth } from "@entities/auth";

/* ---------- Kakao 타입 최소 정의 ---------- */
type KakaoStatus = "OK" | "ZERO_RESULT" | "ERROR";

interface KakaoAddressResult {
  x: string;
  y: string;
}

interface KakaoGeocoder {
  addressSearch(
    addr: string,
    callback: (result: KakaoAddressResult[], status: KakaoStatus) => void,
  ): void;
}

interface KakaoServices {
  Geocoder: new () => KakaoGeocoder;
  Status: any;
}

declare global {
  interface Window {
    kakao: {
      maps: {
        services: KakaoServices;
      };
    };
  }
}

/* ---------- HTML sanitize ---------- */
function toHtml(input?: string): { __html: string } {
  const raw = input ?? "";
  const withBreaks = raw.replace(/\r\n|\r|\n/g, "<br/>");
  const sanitized = DOMPurify.sanitize(withBreaks, {
    ALLOWED_TAGS: [
      "b",
      "strong",
      "i",
      "em",
      "u",
      "s",
      "br",
      "p",
      "div",
      "span",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
      "code",
      "pre",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
  return { __html: sanitized };
}

type UserType = "mentee" | "mentor" | "admin" | "guest";

function normalizeRole(memberType?: string | null): UserType | undefined {
  const t = (memberType ?? "").toUpperCase().trim();
  if (t === "MENTEE" || t === "MENTI") return "mentee";
  if (t === "MENTOR" || t === "MENTO") return "mentor";
  if (t === "ADMIN") return "admin";
  return undefined;
}

type MentoLike = {
  mentoName?: string;
  mentoImg?: string;
  mentoDescription?: string;
};

function pickFirstMento(mento: unknown): MentoLike | undefined {
  if (!mento) return undefined;
  if (Array.isArray(mento)) return (mento[0] as MentoLike) ?? undefined;
  return mento as MentoLike;
}

export default function MentosDetail() {
  const { user } = useAuth();
  const normalized = normalizeRole((user as any)?.memberType ?? (user as any)?.role);
  const isMentor = (normalized ?? "guest") === "mentor";
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<MentosDetailResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const location = useLocation();

  // --- 리뷰 무한 스크롤 상태 ---
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [rvCursor, setRvCursor] = useState<string | null>(null);
  const [rvHasNext, setRvHasNext] = useState(true);
  const [rvLoading, setRvLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);

  const rvSeenRef = useRef<Set<number>>(new Set());
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const ctrlRef = useRef<KakaoMapController | null>(null);

  /* 상세 API 호출 */
  useEffect(() => {
    if (!id) return;

    let alive = true;

    (async () => {
      try {
        const res = await getMentosDetail(Number(id));
        if (alive) {
          setData(res);
          console.log("상세 데이터 로드:", res);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "불러오기에 실패했어요.";
        if (alive) setErr(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  /* 리뷰 페이지 로더 */
  const loadMoreReviews = useCallback(async () => {
    console.log("loadMoreReviews 호출됨:", { id, rvLoading, rvHasNext, rvCursor });

    if (!id || rvLoading || !rvHasNext) {
      console.log("리뷰 로딩 중단:", { id, rvLoading, rvHasNext });
      return;
    }

    console.log("리뷰 로딩 시작:", { id, cursor: rvCursor });
    setRvLoading(true);

    try {
      const page = await getMentosReviewsPage(Number(id), {
        limit: 5,
        cursor: rvCursor,
      });

      console.log("리뷰 응답:", page);

      // 상태 업데이트를 한 번에 처리
      setRvHasNext(page.hasNext);
      setRvCursor(page.nextCursor);

      // seen 체크 없이 직접 추가 (첫 로딩이면 교체, 추가 로딩이면 병합)
      setReviews((prev) => {
        console.log("setReviews 함수 내부:", {
          이전리뷰: prev.length,
          새로운리뷰데이터: page.reviews.length,
          cursor: rvCursor,
          seen: Array.from(rvSeenRef.current),
        });

        // 첫 번째 로딩인 경우 (cursor가 null)
        if (rvCursor === null) {
          console.log("첫 번째 로딩 - 리뷰 교체");
          // seen 초기화 후 새 리뷰들 추가
          rvSeenRef.current.clear();
          page.reviews.forEach((r) => rvSeenRef.current.add(r.reviewSeq));
          return page.reviews;
        } else {
          // 추가 로딩인 경우
          console.log("추가 로딩 - 리뷰 병합");
          const newReviews = page.reviews.filter((r) => !rvSeenRef.current.has(r.reviewSeq));
          newReviews.forEach((r) => rvSeenRef.current.add(r.reviewSeq));
          const updated = [...prev, ...newReviews];

          console.log("리뷰 상태 업데이트:", {
            이전개수: prev.length,
            새로운리뷰: newReviews.length,
            총개수: updated.length,
            실제데이터: updated,
          });

          return updated;
        }
      });
    } catch (e) {
      console.error("[Review] 로드 실패:", e);
    } finally {
      setRvLoading(false);
    }
  }, [id, rvCursor]);

  // ID가 변경되면 모든 상태 초기화
  useEffect(() => {
    console.log("ID 변경으로 리뷰 상태 초기화:", id);

    rvSeenRef.current.clear();
    setReviews([]);
    setRvCursor(null);
    setRvHasNext(true);
    setRvLoading(false);
    setInitialLoad(false);
  }, [id]);

  // 데이터 로드 완료 후 첫 번째 리뷰 페이지 로드
  useEffect(() => {
    console.log("첫 번째 리뷰 로딩 체크:", {
      data: !!data,
      id,
      initialLoad,
      reviewsLength: reviews.length,
    });

    if (!data || !id || initialLoad) return;

    console.log("첫 번째 리뷰 로딩 트리거");
    setInitialLoad(true);

    // 즉시 실행 (지연 제거)
    loadMoreReviews();
  }, [data, id]);

  // IntersectionObserver로 무한 스크롤 구현
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !rvHasNext || rvLoading) return;

    console.log("IntersectionObserver 설정");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("Intersection 감지, 리뷰 추가 로딩");
            loadMoreReviews();
          }
        });
      },
      {
        root: null,
        rootMargin: "200px 0px",
        threshold: 0.1,
      },
    );

    io.observe(node);
    return () => {
      console.log("IntersectionObserver 해제");
      io.disconnect();
    };
  }, [rvHasNext, rvLoading]);

  /* 지도 초기화 */
  useEffect(() => {
    if (!data) return;

    const host = mapDivRef.current;
    if (!host) return;

    const ctrl = new KakaoMapController(host);
    ctrlRef.current = ctrl;

    (async () => {
      try {
        await ctrl.init();
        ctrl.relayout();
        setTimeout(() => ctrl.relayout(), 0);
      } catch (e) {
        console.error("[Map] 지도 초기화 실패:", e);
      }
    })();

    return () => {
      try {
        ctrlRef.current?.destroy();
      } catch {}
      ctrlRef.current = null;
    };
  }, [data]);

  /* 주소 지오코딩 */
  useEffect(() => {
    const ctrl = ctrlRef.current;
    const address = data?.mentosLocation;
    if (!ctrl || !address) return;

    const services = window.kakao?.maps?.services;
    if (!services) {
      console.warn("[Map] services가 없습니다. SDK에 &libraries=services 포함 필요");
      return;
    }

    const geocoder = new services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === "OK" && result?.[0]) {
        const lat = parseFloat(result[0].y);
        const lng = parseFloat(result[0].x);
        ctrl.setMyLocation(lat, lng);
        ctrl.relayout();
      } else {
        console.warn("[Map] 지오코딩 실패:", address, status);
        ctrl.setMyLocation(37.5665, 126.978);
        ctrl.relayout();
      }
    });
  }, [data?.mentosLocation]);

  /* 예약 이동 */
  const handleGoBooking = () => {
    if (!id || !data) return;
    if (isMentor) return;

    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    navigate("/booking", {
      state: {
        mentosSeq: Number(id),
        title: data.mentosTitle,
        price: data.mentosPrice,
      },
    });
  };

  /* 가드 */
  if (loading) return <div className="p-4">불러오는 중…</div>;
  if (err) return <div className="p-4 text-red-600">에러: {err}</div>;
  if (!data) return <div className="p-4">데이터가 없어요.</div>;

  const mento = pickFirstMento((data as unknown as { mento?: MentoLike | MentoLike[] }).mento);
  const ratingAvg = Number.isFinite(data.reviewRatingAvg) ? data.reviewRatingAvg : 0;
  const reviewCountText = Number(data.reviewTotalCnt ?? 0).toLocaleString();

  return (
    <div className="flex w-full flex-col gap-5 bg-white">
      {/* 상단 이미지 */}
      <section className="flex h-[20%] w-full items-center justify-center">
        <img className="w-full" src={data.mentosImage} alt="mentos image" />
      </section>

      {/* 타이틀, 위치, 시간, 별점 */}
      <section className="flex w-full flex-col gap-3 px-4">
        <p className="font-WooridaumB text-[1.2rem] font-bold">{data.mentosTitle}</p>

        <div className="flex flex-row items-center gap-1.5 text-sm">
          <img src={locationIcon} alt="location" />
          <span className="font-WooridaumR text-[0.8rem] leading-3 text-[#a0a09c]">
            {data.mentosLocation}
          </span>
        </div>

        <div className="flex h-full items-center justify-between">
          <div className="flex w-auto flex-row items-center gap-1.5 text-sm">
            <img src={clockIcon} alt="clock" />
            <span className="font-WooridaumR text-[0.8rem] leading-3 text-[#a0a09c]">총 1시간</span>
          </div>

          <div className="flex h-full items-center">
            <div className="flex gap-1">
              <img
                className="inline-block h-[0.6rem] w-[0.6rem] align-middle"
                src={starIcon}
                alt="star"
              />
              <span className="font-WooridaumB text-[0.9rem] leading-3 font-bold text-gray-900">
                {ratingAvg.toFixed(2)}
              </span>
            </div>
            <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500" />
            <span className="font-WooridaumB text-[0.8rem] leading-3 font-medium text-gray-900 underline">
              {reviewCountText}건 리뷰
            </span>
          </div>
        </div>
      </section>

      {/* 리뷰 캐러셀 */}
      <section className="w-full pt-6">
        {reviews.length > 0 ? (
          <SnapCarousel className="flex w-full">
            {reviews.map((rv) => (
              <div key={rv.reviewSeq} className="snap-item w-[85%] flex-none snap-center">
                <ReviewMentosDetailCard
                  value={rv.reviewRating}
                  context={rv.reviewContent}
                  name={rv.memberName ?? "익명 멘토"}
                />
              </div>
            ))}

            {/* Sentinel 요소 - 더 불러오기 트리거 */}
            {rvHasNext && (
              <div
                ref={sentinelRef}
                className="snap-item flex w-[85%] flex-none snap-center items-center justify-center">
                <button
                  type="button"
                  disabled={rvLoading}
                  onClick={loadMoreReviews}
                  className="rounded-xl border px-4 py-3 text-sm disabled:opacity-50">
                  {rvLoading ? "불러오는 중…" : "리뷰 더 불러오기"}
                </button>
              </div>
            )}

            {!rvHasNext && reviews.length > 0 && (
              <div className="snap-item flex w-[85%] flex-none snap-center items-center justify-center">
                <div className="text-xs text-gray-500">끝까지 보셨습니다.</div>
              </div>
            )}
          </SnapCarousel>
        ) : (
          <div className="flex w-full justify-center py-8">
            <div className="text-sm text-gray-500">
              {rvLoading ? "리뷰를 불러오는 중..." : "아직 리뷰가 없어요."}
            </div>
          </div>
        )}
      </section>

      {/* 지도 섹션 */}
      <section className="flex w-full justify-center border-b border-b-zinc-100 px-4 py-2">
        <div className="w-full overflow-hidden rounded-xl border border-gray-200">
          <div ref={mapDivRef} id="mentos-detail-map" className="h-[220px] min-h-[220px] w-full" />
        </div>
      </section>

      {/* 멘토 소개 & 상세 설명 */}
      <section className="flex w-full justify-center px-4 pt-10">
        <div className="w-full max-w-sm">
          <h2 className="font-WooridaumB mb-3 text-center text-xl font-extrabold">멘토 소개</h2>

          <div className="flex justify-center">
            <div className="h-40 w-40 overflow-hidden rounded-full shadow-md ring-4 ring-white">
              <img
                src={mento?.mentoImg}
                alt="멘토 프로필"
                className="border- h-full w-full rounded-full object-cover"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-center">
            <span className="text-m rounded-full bg-[#0059FF] px-4 py-1 font-bold text-white">
              {mento?.mentoName ?? "익명 멘토"}
            </span>
          </div>

          <div className="-mt-4 rounded-[20px] bg-[#F4F4F4] p-6 shadow-sm">
            <div
              className="text-[17px] leading-relaxed font-medium"
              dangerouslySetInnerHTML={toHtml(mento?.mentoDescription)}
            />
          </div>

          <div className="mt-15 flex w-full flex-col items-center px-2 pb-4 text-center text-[0.9rem]">
            <div
              className="text-center leading-relaxed"
              dangerouslySetInnerHTML={toHtml(data.mentosDescription)}
            />
          </div>
        </div>
      </section>

      {/* 하단 가격 + 버튼 */}
      <div className="flex w-full items-center gap-4 border-t border-t-zinc-100 p-4">
        <div className="flex-1 text-center">
          <span className="font-WooridaumB font-bold">
            {Number(data.mentosPrice).toLocaleString()}원
          </span>
        </div>
        {isMentor ? (
          <div className="flex-1" />
        ) : (
          <Button variant="primary" size="lg" className="flex-1" onClick={handleGoBooking}>
            예약하기
          </Button>
        )}
      </div>
    </div>
  );
}
