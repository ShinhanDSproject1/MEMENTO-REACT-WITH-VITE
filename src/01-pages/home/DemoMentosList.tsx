// src/pages/MentosCarouselPage.tsx
import { motion, PanInfo, useReducedMotion, type MotionProps } from "framer-motion";
import { CreditCard, Lightbulb, LineChart, Menu, PiggyBank, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import mementoLogo from "@shared/assets/images/logo/memento-logo.svg";
import bgVideo from "@shared/assets/video/mainVideo3.mp4";

/* ----------------------------- Types & Const ----------------------------- */

type CategoryKey = "spending" | "life" | "saving" | "growth";

export interface MentosItem {
  mentosSeq: number;
  approved: boolean;
  mentosImg: string;
  mentosTitle: string;
  mentosPrice: number;
  region: string;
}

const CATEGORIES: { key: CategoryKey; label: string; Icon: any }[] = [
  { key: "spending", label: "소비패턴", Icon: CreditCard },
  { key: "life", label: "생활노하우", Icon: Lightbulb },
  { key: "saving", label: "저축방식", Icon: PiggyBank },
  { key: "growth", label: "자산증식", Icon: LineChart },
];

// 데모 데이터
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
    mentosTitle: "구독 정리 & 지갑 다이어트",
    mentosPrice: 24000,
    region: "서울 마포구",
  },
  {
    mentosSeq: 106,
    approved: true,
    mentosImg:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop",
    mentosTitle: "배당 포트폴리오 입문",
    mentosPrice: 64000,
    region: "대전 유성구",
  },
];

const BORDER_OPACITY = 0.7;
const BORDER_WIDTH = 10;
const DARK_OVERLAY_OPACITY = 0.8;

/* --------------------------------- Utils -------------------------------- */

const mapCategoryBySeq = (seq: number): CategoryKey =>
  (["spending", "life", "saving", "growth"] as const)[seq % 4];

const priceKRW = (n: number) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(n);

/* --------------------------------- Page --------------------------------- */

export default function MentosCarouselPage() {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState<CategoryKey | "all">("all");
  const [menuOpen, setMenuOpen] = useState(false);

  const list = MOCK;
  const items = useMemo(
    () => (active === "all" ? list : list.filter((i) => mapCategoryBySeq(i.mentosSeq) === active)),
    [active, list],
  );

  /* --------- Desktop rail: scroll helpers --------- */
  const railRef = useRef<HTMLDivElement>(null);
  const scrollByCard = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-card]");
    const gap = 16;
    const step = card ? card.offsetWidth + gap : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    rail.style.scrollbarWidth = "none";
    (rail.style as any).msOverflowStyle = "none";
    const css = document.createElement("style");
    css.innerHTML = `.no-scrollbar::-webkit-scrollbar{display:none}`;
    document.head.appendChild(css);
    return () => document.head.removeChild(css);
  }, []);

  const fadeUp: MotionProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  };

  /* ----------------------- Mobile dial state ----------------------- */
  const [dialAngle, setDialAngle] = useState(0); // 실제 회전 각도(도)
  const STEP_DEG = 28; // 카드 1장당 각도 간격
  const activeIdx = Math.round(dialAngle / STEP_DEG); // 중앙 선택 인덱스
  const clampAngle = (a: number) => Math.max(0, Math.min((items.length - 1) * STEP_DEG, a));

  const onDialDrag = (_: any, info: PanInfo) => {
    // X 이동량을 각도로 매핑(감도 조절)
    const delta = info.delta.x * 0.4;
    setDialAngle((prev) => clampAngle(prev + delta));
  };
  const onDialDragEnd = () => {
    // 가까운 카드에 스냅
    const snapped = Math.round(dialAngle / STEP_DEG) * STEP_DEG;
    setDialAngle(clampAngle(snapped));
  };

  return (
    <div className="fixed inset-0 z-[60]">
      {/* 배경 비디오 */}
      <div
        className="fixed top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-black/10"
        style={{
          boxShadow: "0 30px 70px rgba(0,0,0,0.25)",
          borderStyle: "solid",
          borderWidth: BORDER_WIDTH,
          borderColor: `rgba(0,0,0,${BORDER_OPACITY})`,
          WebkitMaskImage: "radial-gradient(white, black)",
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
        }}>
        <video
          aria-hidden
          className="h-full w-full object-cover"
          src={bgVideo}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* 어둡게 */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: DARK_OVERLAY_OPACITY }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ backgroundColor: "#000" }}
      />

      {/* 헤더 */}
      <header className="fixed top-3 right-[6vw] left-[6vw] z-40 flex items-center justify-between">
        <img
          src={mementoLogo}
          alt="memento logo"
          className="h-auto w-[110px] sm:w-[150px] md:w-[180px]"
        />

        {/* 데스크톱 카테고리 */}
        <nav className="hidden md:block" aria-label="빠른 시작 카테고리">
          <div className="flex items-center gap-3">
            <span className="inline-flex cursor-default items-center gap-2 rounded-full px-5 py-2.5 text-[16px] font-bold text-white/95">
              금융멘토링 주제별로 살펴보기
            </span>
            <button
              onClick={() => setActive("all")}
              className={`rounded-full px-5 py-2.5 text-[16px] font-bold transition ${
                active === "all" ? "bg-white text-[#111]" : "text-white/95 hover:text-[#3B82F6]"
              }`}>
              전체
            </button>
            {CATEGORIES.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[16px] font-bold transition ${
                  active === key ? "bg-white text-[#111]" : "text-white/95 hover:text-[#3B82F6]"
                }`}>
                <Icon className="h-5 w-5 opacity-90" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* 모바일 햄버거 */}
        <div className="md:hidden">
          <button
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-xl bg-black/20 p-2 text-white ring-1 ring-white/10 backdrop-blur-sm active:scale-95">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* 드롭다운 */}
          <motion.div
            initial={false}
            animate={{
              opacity: menuOpen ? 1 : 0,
              y: menuOpen ? 0 : -6,
              pointerEvents: menuOpen ? "auto" : "none",
            }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-[6vw] mt-2 w-[58vw] max-w-[320px] min-w-[220px] overflow-hidden rounded-2xl p-1.5 text-white ring-1 ring-white/10 backdrop-blur-md"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
            <button
              type="button"
              onClick={() => {
                setActive("all");
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[14px] font-semibold hover:bg-white/10">
              전체
            </button>
            {CATEGORIES.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActive(key);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[14px] font-semibold hover:bg-white/10">
                <Icon className="h-4 w-4 opacity-90" />
                <span>{label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </header>

      {/* -------------------- Desktop: 가로 캐러셀 -------------------- */}
      <div className="absolute top-24 right-0 bottom-10 left-0 hidden items-center justify-center px-4 md:flex md:px-6">
        <div className="relative w-full max-w-[1400px]">
          {/* 좌우 버튼 */}
          <button
            onClick={() => scrollByCard(-1)}
            className="absolute top-1/2 -left-2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow ring-1 ring-black/10 backdrop-blur md:block">
            ◀
          </button>
          <button
            onClick={() => scrollByCard(1)}
            className="absolute top-1/2 -right-2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow ring-1 ring-black/10 backdrop-blur md:block">
            ▶
          </button>

          <motion.div
            {...fadeUp}
            ref={railRef}
            className="no-scrollbar -mx-1 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-1 py-2">
            {items.map((item) => (
              <Card key={item.mentosSeq} item={item} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* -------------------- Mobile: Dial + Arc Cards -------------------- */}
      <div className="absolute inset-x-0 top-20 bottom-0 z-30 px-4 md:hidden">
        {/* 부채꼴 카드 레이어 */}
        <div className="relative mx-auto mt-6 h-[54vh] max-h-[520px] w-full">
          {items.map((item, idx) => {
            // 현재 각도 기준 상대 위치
            const offset = idx - activeIdx;
            const angle = offset * STEP_DEG; // 카드를 배치할 각도
            const clamped = Math.max(-80, Math.min(80, angle)); // 부채꼴 제한
            const radius = 240; // 부채꼴 반경
            const rad = (clamped * Math.PI) / 180;
            const x = Math.sin(rad) * radius;
            const y = (1 - Math.cos(rad)) * radius * 0.62; // 살짝 납작한 원

            const scale = 1 - Math.abs(clamped) / 300; // 중앙 클수록 크게
            const opacity = 1 - Math.abs(clamped) / 120; // 중앙 클수록 진하게
            const z = 1000 - Math.abs(clamped) * 10; // 중앙이 위로

            return (
              <motion.div
                key={item.mentosSeq}
                className="absolute top-[6%] left-1/2 w-[68vw] -translate-x-1/2 sm:w-[58vw]"
                style={{ zIndex: Math.round(z) }}
                animate={{ x, y, scale, opacity }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}>
                <SmallArcCard item={item} focused={idx === activeIdx} />
              </motion.div>
            );
          })}
        </div>

        {/* 하단 다이얼 */}
        <div className="pointer-events-none relative mx-auto mt-2 mb-[22px] grid h-[160px] w-[160px] place-items-center">
          <div className="pointer-events-auto relative h-[120px] w-[120px] rounded-full bg-gradient-to-br from-indigo-400 via-blue-400 to-purple-400 shadow-2xl">
            <motion.div
              drag="x"
              dragConstraints={{ left: -80, right: 80 }}
              onDrag={onDialDrag}
              onDragEnd={onDialDragEnd}
              className="absolute top-1/2 left-1/2 h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow"
              style={{ rotate: dialAngle }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Sub-UI -------------------------------- */

function Card({ item }: { item: MentosItem }) {
  const tag = {
    spending: "소비패턴",
    life: "생활노하우",
    saving: "저축방식",
    growth: "자산증식",
  }[mapCategoryBySeq(item.mentosSeq)];

  return (
    <motion.div
      data-card
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-[260px] w-[72vw] snap-start overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur sm:w-[56vw] md:h-[300px] md:w-[360px] lg:w-[400px]">
      <div className="relative h-full w-full">
        <img
          src={item.mentosImg}
          alt={item.mentosTitle}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.05]"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")}
        />

        {/* 상단 좌측 뱃지 */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur ${
              item.approved ? "bg-green-600/85 text-white" : "bg-gray-600/80 text-white"
            }`}>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
            {item.approved ? "승인됨" : "대기"}
          </span>
          <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            {tag}
          </span>
        </div>

        {/* 하단 정보 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="h-28 bg-gradient-to-t from-black/75 to-transparent" />
          <div className="absolute bottom-0 w-full p-4">
            <h3 className="line-clamp-2 text-[15px] font-extrabold text-white drop-shadow">
              {item.mentosTitle}
            </h3>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[12px] text-gray-200">{item.region}</span>
              <span className="text-[14px] font-extrabold text-white">
                {priceKRW(item.mentosPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="absolute right-3 bottom-3">
          <button
            type="button"
            className="rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-gray-900 shadow transition hover:bg-white"
            onClick={() => alert(`선택: ${item.mentosTitle} (#${item.mentosSeq})`)}>
            자세히 보기
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SmallArcCard({ item, focused }: { item: MentosItem; focused: boolean }) {
  const tag = {
    spending: "소비패턴",
    life: "생활노하우",
    saving: "저축방식",
    growth: "자산증식",
  }[mapCategoryBySeq(item.mentosSeq)];

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 backdrop-blur ${focused ? "bg-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.35)]" : "bg-white/8 shadow"} w-[60vw] max-w-[360px]`}>
      <div className="relative aspect-[4/3] w-full">
        <img
          src={item.mentosImg}
          alt={item.mentosTitle}
          className="h-full w-full object-cover"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")}
        />
        {/* 상단 뱃지 */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.approved ? "bg-green-600/85 text-white" : "bg-gray-600/80 text-white"}`}>
            {item.approved ? "승인됨" : "대기"}
          </span>
          <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">{tag}</span>
        </div>

        {/* 하단 정보 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="h-20 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 w-full p-3">
            <h3 className="line-clamp-2 text-[13px] font-bold text-white">{item.mentosTitle}</h3>
            <div className="mt-0.5 flex items-center justify-between text-white/90">
              <span className="text-[11px]">{item.region}</span>
              <span className="text-[12px] font-extrabold">{priceKRW(item.mentosPrice)}</span>
            </div>
          </div>
        </div>
      </div>
      {/* CTA */}
      <div className="p-2">
        <button
          className="w-full rounded-xl bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-gray-900 hover:bg-white"
          onClick={() => alert(`선택: ${item.mentosTitle} (#${item.mentosSeq})`)}>
          자세히 보기
        </button>
      </div>
    </div>
  );
}
