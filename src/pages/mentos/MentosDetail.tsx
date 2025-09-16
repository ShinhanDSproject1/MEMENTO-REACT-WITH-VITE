// src/pages/MentosDetail.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/widgets/common/Button";
import SnapCarousel from "@/widgets/common/SnapCarousel";
import ReviewMentosDetailCard from "@/widgets/mentos/ReviewMentosDetailCard";
import clockIcon from "@assets/icons/icon-clock.svg";
import locationIcon from "@assets/icons/icon-location.svg";
import starIcon from "@assets/icons/icon-star.svg";
import DOMPurify from "dompurify";

import { getMentosDetail } from "@shared/api/mentos";
import type { MentosDetailResult } from "@shared/api/mentos";

// 카카오맵 컨트롤러
import { KakaoMapController } from "@entities/editor";

// TS가 window.kakao를 인지하도록 선언
declare global {
  interface Window {
    kakao: any;
  }
}

function toHtml(input?: string) {
  const raw = input ?? "";
  // \r\n, \r, \n → <br/>  (태그는 건드리지 않음)
  const withBreaks = raw.replace(/\r\n|\r|\n/g, "<br/>");

  // 허용할 태그/속성만 선택적으로 열어두기
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

export default function MentosDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 상세 데이터 상태
  const [data, setData] = useState<MentosDetailResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // 지도 관련 ref
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const ctrlRef = useRef<KakaoMapController | null>(null);

  /* 1) 상세 API 호출 */
  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        const res = await getMentosDetail(Number(id));
        if (alive) setData(res);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "불러오기에 실패했어요.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  // (2) 지도 초기화 — 데이터가 왔을 때 실행
  useEffect(() => {
    if (!data) return; // 데이터가 없으면 지도 섹션도 아직 안 그려졌을 확률↑
    let mounted = true;

    const host = mapDivRef.current;
    console.log("[Map:init] host ref:", host); // ✅ null인지 로그로 바로 확인
    if (!host) return;

    const ctrl = new KakaoMapController(host);
    ctrlRef.current = ctrl;

    (async () => {
      try {
        await ctrl.init();
        console.log("[Map:init] created");
        ctrl.relayout();
        setTimeout(() => ctrl.relayout(), 0);
      } catch (e) {
        console.error("[Map] 지도 초기화 실패:", e);
      }
    })();

    return () => {
      mounted = false;
      try {
        ctrlRef.current?.destroy();
      } catch {}
      ctrlRef.current = null;
    };
  }, [data]);

  // (3) 데이터 들어오면 주소 지오코딩 → 지도 중심/마커
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
    geocoder.addressSearch(address, (result: any[], status: string) => {
      if (status === services.Status.OK && result?.[0]) {
        const lat = parseFloat(result[0].y);
        const lng = parseFloat(result[0].x);

        ctrl.setMyLocation(lat, lng);

        // ✅ 지오코딩으로 좌표 찍은 직후에도 재배치
        ctrl.relayout();
      } else {
        console.warn("[Map] 지오코딩 실패:", address, status);

        // (선택) 기본 위치라도 보여주기
        ctrl.setMyLocation(37.5665, 126.978);
        ctrl.relayout();
      }
    });
  }, [data?.mentosLocation]);

  /* 예약 이동 */
  const handleGoBooking = () => {
    if (!id || !data) return;
    navigate("/booking", {
      state: {
        mentorId: Number(id),
        title: data.mentosTitle,
        price: data.mentosPrice,
      },
    });
  };

  /* 가드 */
  if (loading) return <div className="p-4">불러오는 중…</div>;
  if (err) return <div className="p-4 text-red-600">에러: {err}</div>;
  if (!data) return <div className="p-4">데이터가 없어요.</div>;

  // mento가 객체/배열 둘 다 올 수 있으므로 안전 처리
  const mento = Array.isArray((data as any).mento) ? (data as any).mento[0] : (data as any).mento;
  const reviewCountText = data.reviewTotalCnt.toLocaleString();

  return (
    <div className="flex w-full flex-col gap-2 bg-white">
      {/* 상단 이미지 */}
      <section className="flex h-[20%] w-full items-center justify-center">
        <img className="w-full" src={data.mentosImage} alt="mentos image" />
      </section>

      {/* 타이틀, 위치, 시간, 별점 */}
      <section className="flex w-full flex-col gap-2 px-4">
        <p className="font-WooridaumB text-[0.85rem] font-bold">{data.mentosTitle}</p>
        <div className="flex flex-row items-center gap-1.5 text-sm">
          <img src={locationIcon} alt="location" />
          <span className="font-WooridaumB text-[0.6rem] leading-3">{data.mentosLocation}</span>
        </div>
        <div className="flex h-full items-center justify-between">
          <div className="flex w-auto flex-row items-center gap-1.5 text-sm">
            <img src={clockIcon} alt="clock" />
            <span className="font-WooridaumB text-[0.6rem] leading-3">총 1시간</span>
          </div>
          <div className="flex h-full items-center">
            <div className="flex gap-1">
              <img
                className="inline-block h-[0.6rem] w-[0.6rem] align-middle"
                src={starIcon}
                alt="star"
              />
              <span className="font-WooridaumB text-[0.6rem] leading-3 font-bold text-gray-900">
                {data.reviewRatingAvg.toFixed(2)}
              </span>
            </div>
            <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500" />
            <span className="font-WooridaumB text-[0.6rem] leading-3 font-medium text-gray-900 underline">
              {reviewCountText}건 리뷰
            </span>
          </div>
        </div>
      </section>

      {/* 리뷰 캐러셀 */}
      <SnapCarousel className="flex w-full pt-6">
        {(data.reviews?.length ? data.reviews : []).map((rv) => (
          <div key={rv.reviewSeq} className="snap-item w-[85%] flex-none snap-center">
            <ReviewMentosDetailCard
              value={rv.reviewRating}
              context={rv.reviewContent}
              name={mento?.mentoName ?? "익명 멘토"}
            />
          </div>
        ))}
      </SnapCarousel>

      {/* 지도 섹션 */}
      <section className="flex w-full justify-center border-b border-b-zinc-100 px-4 py-2">
        <div className="w-full overflow-hidden rounded-xl border border-gray-200">
          {/* ⚠️ 지도 컨테이너는 px 높이가 꼭 있어야 타일이 렌더됨 */}
          <div ref={mapDivRef} id="mentos-detail-map" className="h-[220px] min-h-[220px] w-full" />
        </div>
      </section>

      {/* 멘토 소개 */}

      {/* 멘토 소개 — 이미지처럼 정렬/배치 */}
      <section className="flex w-full justify-center px-4 pt-10">
        <div className="w-full max-w-sm">
          {/* 타이틀 */}
          <h2 className="font-WooridaumB mb-3 text-center text-xl font-extrabold">멘토 소개</h2>

          {/* 아바타 */}
          <div className="flex justify-center">
            <div className="h-40 w-40 overflow-hidden rounded-full shadow-md ring-4 ring-white">
              <img
                src={data.mento.mentoImg}
                alt="멘토 프로필"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* 이름 배지(핵심 포인트 색상) */}
          <div className="mt-3 flex justify-center">
            <span className="rounded-full bg-[#0059FF] px-4 py-1 text-sm font-bold text-white">
              {mento?.mentoName ?? "익명 멘토"}
            </span>
          </div>

          {/* 소개 카드(둥근 박스) : 카드가 위로 살짝 끌려오도록 -mt 사용 */}
          <div className="-mt-4 rounded-[20px] bg-[#F4F4F4] p-6 shadow-sm">
            {/* 본문 */}
            <div
              className="text-center leading-relaxed" // ⚠️ innerHTML 쓸 땐 whitespace-pre-line 빼세요
              dangerouslySetInnerHTML={toHtml(mento?.mentoDescription)}
            />
          </div>
          {/* 상세 설명 */}
          <div className="mt-8 flex w-full flex-col items-center justify-center px-2 pb-4 text-center text-[0.8rem]">
            <div
              className="text-center leading-relaxed" // ⚠️ innerHTML 쓸 땐 whitespace-pre-line 빼세요
              dangerouslySetInnerHTML={toHtml(data.mentosDescription)}
            />
          </div>
        </div>
      </section>

      {/* 하단 가격 + 버튼 */}
      <div className="flex w-full flex-row items-center justify-center gap-4 border-t border-t-zinc-100 p-4">
        <div className="flex-1 text-center">
          <span className="font-WooridaumB font-bold">
            {Number(data.mentosPrice).toLocaleString()}원
          </span>
        </div>
        <Button variant="primary" size="lg" className="flex-1" onClick={handleGoBooking}>
          예약하기
        </Button>
      </div>
    </div>
  );
}
