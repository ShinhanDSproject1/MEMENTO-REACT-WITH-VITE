// src/pages/MentosDiscoverDemo.tsx
import { motion } from "framer-motion";
import { CreditCard, Lightbulb, LineChart, PiggyBank } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

// --- 캐릭터/브랜딩 에셋(없는 경우 임시 이미지로 대체) ---
import characterGom from "@shared/assets/images/character/character-gom-blue.png";
import mementoLogo from "@shared/assets/images/logo/memento-logo.svg";

// ========== 타입 & 유틸 ==========
type CategoryKey = "spending" | "life" | "saving" | "growth";

export interface MentosItem {
  mentosSeq: number;
  approved: boolean;
  mentosImg: string;
  mentosTitle: string;
  mentosPrice: number;
  region: string; // bname
}

const CATEGORIES: { key: CategoryKey; label: string; Icon: any }[] = [
  { key: "spending", label: "소비패턴", Icon: CreditCard },
  { key: "life", label: "생활노하우", Icon: Lightbulb },
  { key: "saving", label: "저축방식", Icon: PiggyBank },
  { key: "growth", label: "자산증식", Icon: LineChart },
];

// 목데이터(실 API 대체)
const MOCK: MentosItem[] = [
  {
    mentosSeq: 101,
    approved: true,
    mentosImg:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    mentosTitle: "지출 패턴 진단 & 카드 최적화",
    mentosPrice: 39000,
    region: "서울 강남구",
  },
  {
    mentosSeq: 102,
    approved: true,
    mentosImg:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop",
    mentosTitle: "자취생 생활비 절약 꿀팁",
    mentosPrice: 19000,
    region: "부산 해운대구",
  },
  {
    mentosSeq: 103,
    approved: false,
    mentosImg:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
    mentosTitle: "적금/예금 루틴 설계",
    mentosPrice: 29000,
    region: "대구 수성구",
  },
  {
    mentosSeq: 104,
    approved: true,
    mentosImg:
      "https://images.unsplash.com/photo-1454165205744-3b78555e5572?q=80&w=1200&auto=format&fit=crop",
    mentosTitle: "ETF로 시작하는 자산 증식",
    mentosPrice: 59000,
    region: "인천 연수구",
  },
  {
    mentosSeq: 105,
    approved: true,
    mentosImg:
      "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop",
    mentosTitle: "구독 서비스 정리 & 지갑 다이어트",
    mentosPrice: 24000,
    region: "서울 마포구",
  },
  {
    mentosSeq: 106,
    approved: false,
    mentosImg:
      "https://images.unsplash.com/photo-1518081461904-9ac3d08647cb?q=80&w=1200&auto=format&fit=crop",
    mentosTitle: "신혼부부 생활비 합치기 가이드",
    mentosPrice: 34000,
    region: "경기 성남시",
  },
  {
    mentosSeq: 107,
    approved: true,
    mentosImg:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    mentosTitle: "목표 저축률 40% 달성 플랜",
    mentosPrice: 33000,
    region: "광주 북구",
  },
  {
    mentosSeq: 108,
    approved: true,
    mentosImg:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop",
    mentosTitle: "초보자를 위한 배당 포트폴리오",
    mentosPrice: 64000,
    region: "대전 유성구",
  },
];

function mapCategoryBySeq(seq: number): CategoryKey {
  const arr: CategoryKey[] = ["spending", "life", "saving", "growth"];
  return arr[seq % arr.length];
}

function priceKRW(value: number) {
  try {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString()}원`;
  }
}

// ========== 페이지 ==========
export default function MentosDiscoverDemo() {
  const [typed, setTyped] = useState("");
  const [typedDone, setTypedDone] = useState(false);
  const [active, setActive] = useState<CategoryKey | "all">("all");
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<MentosItem[]>([]);

  const listRef = useRef<HTMLDivElement | null>(null);

  // 인트로 타이핑(스플래시 톤)
  useEffect(() => {
    const full =
      "안녕하세요! 저는 메멘토의 AI 도우미 ‘토리’예요.\n보고 싶은 주제를 선택하면, 딱 맞는 멘토링을 보여드릴게요.";
    let i = 0;
    const step = () => {
      i++;
      setTyped(full.slice(0, i));
      if (i < full.length) {
        setTimeout(step, 35);
      } else {
        setTypedDone(true);
      }
    };
    setTimeout(step, 150);
  }, []);

  // 데모 로딩
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setList(MOCK);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    if (active === "all") return list;
    return list.filter((i) => mapCategoryBySeq(i.mentosSeq) === active);
  }, [active, list]);

  const onPickCategory = (key: CategoryKey | "all") => {
    setActive(key);
    // 리스트 섹션으로 부드럽게 스크롤
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  // 애니 공통
  const fadeUp = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#0B1020] to-[#0B1020] text-white">
      {/* 헤더 */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4">
        <img src={mementoLogo} alt="memento logo" className="h-7 w-auto opacity-95" />
        <nav className="hidden gap-2 md:flex">
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-white/15 transition ${
              active === "all" ? "bg-white text-[#0B1020]" : "bg-white/5 hover:bg-white/10"
            }`}
            onClick={() => onPickCategory("all")}>
            전체
          </button>
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-white/15 transition ${
                active === key ? "bg-white text-[#0B1020]" : "bg-white/5 hover:bg-white/10"
              }`}
              onClick={() => onPickCategory(key)}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* 히어로(캐릭터 드리븐) */}
      <section className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-5 pt-6 pb-10 md:grid-cols-12 md:gap-10 lg:pb-14">
        {/* 좌측: 말풍선 */}
        <motion.div className="order-2 md:order-1 md:col-span-7" {...(fadeUp as any)}>
          <div className="relative z-10 max-w-2xl rounded-2xl border border-white/10 bg-white/95 p-5 text-[#23272E] shadow-2xl">
            <p className="text-[16px] leading-7 whitespace-pre-line">{typed}</p>
            <div className="absolute top-full left-8 h-4 w-4 -translate-y-1 rotate-45 rounded-[4px] border-t border-l border-black/5 bg-white/95" />
          </div>

          {/* 모바일 카테고리(말풍선 아래) */}
          <div className="mt-4 flex gap-2 md:hidden">
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-white/15 transition ${
                active === "all"
                  ? "bg-white text-[#0B1020]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => onPickCategory("all")}>
              전체
            </button>
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-white/15 transition ${
                  active === key
                    ? "bg-white text-[#0B1020]"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                onClick={() => onPickCategory(key)}>
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 우측: 캐릭터 + 글로우 */}
        <motion.div
          className="order-1 mx-auto flex items-end justify-center md:order-2 md:col-span-5"
          {...(fadeUp as any)}>
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[-12%] -z-10 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(59,130,246,0.48), rgba(59,130,246,0.2) 55%, rgba(59,130,246,0) 75%)",
                filter: "blur(26px)",
              }}
            />
            <img
              src={characterGom}
              alt="메멘토 캐릭터 토리"
              className="h-auto w-[68vw] max-w-[360px] md:max-w-[420px]"
            />
          </div>
        </motion.div>
      </section>

      {/* 컨텐츠 섹션(리스트) */}
      <section
        ref={listRef}
        className="mx-auto w-full max-w-7xl rounded-t-3xl bg-white px-5 pt-6 pb-16 text-[#0B1020]">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold md:text-2xl">
              {active === "all"
                ? "전체 멘토링"
                : (CATEGORIES.find((c) => c.key === active)?.label ?? "멘토링")}
            </h2>
            <p className="mt-1 text-sm text-gray-500">사진 중심의 카드뷰 (앱 2열 / 웹 2~3열)</p>
          </div>
        </div>

        {/* 로딩 스켈레톤 */}
        {loading && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="overflow-hidden rounded-2xl border bg-white">
                <div className="relative aspect-[4/3] w-full animate-pulse bg-gray-200" />
                <div className="p-4">
                  <div className="mb-2 h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                  <div className="mb-2 h-5 w-5/6 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* 목록 */}
        {!loading && (
          <>
            {filtered.length === 0 ? (
              <div className="grid place-items-center py-16 text-gray-500">
                표시할 항목이 없어요.
              </div>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
                {filtered.map((item) => (
                  <li
                    key={item.mentosSeq}
                    className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
                    {/* 이미지(큰 썸네일) */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                      <img
                        src={item.mentosImg}
                        alt={item.mentosTitle}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                        }}
                      />

                      {/* 승인 뱃지 */}
                      <div className="absolute top-2 left-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur ${
                            item.approved
                              ? "bg-green-600/90 text-white"
                              : "bg-gray-700/80 text-white"
                          }`}>
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                          {item.approved ? "승인됨" : "대기"}
                        </span>
                      </div>

                      {/* 카테고리 칩 */}
                      <div className="absolute top-2 right-2">
                        <span className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-gray-800 shadow">
                          {
                            {
                              spending: "소비패턴",
                              life: "생활노하우",
                              saving: "저축방식",
                              growth: "자산증식",
                            }[mapCategoryBySeq(item.mentosSeq)]
                          }
                        </span>
                      </div>

                      {/* 하단 그라데이션 + 타이틀 */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0">
                        <div className="h-24 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 w-full p-3">
                          <h3 className="line-clamp-2 text-[14px] font-bold text-white drop-shadow md:text-[15px]">
                            {item.mentosTitle}
                          </h3>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[12px] text-gray-200">{item.region}</span>
                            <span className="text-[13px] font-extrabold text-white">
                              {priceKRW(item.mentosPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 카드 하단 */}
                    <div className="p-3">
                      <button
                        type="button"
                        className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99]"
                        onClick={() => alert(`선택: ${item.mentosTitle} (#${item.mentosSeq})`)}>
                        자세히 보기
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  );
}
