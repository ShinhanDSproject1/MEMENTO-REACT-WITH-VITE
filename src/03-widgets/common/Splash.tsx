// src/widgets/splash/Splash.tsx
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import { ArrowRight, CreditCard, Lightbulb, LineChart, PiggyBank } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import characterGom from "@shared/assets/images/character/character-gom-blue.png";
import mementoLogo from "@shared/assets/images/logo/memento-logo.svg";
import bgVideo from "@shared/assets/video/mainVideo3.mp4"; // 필요시 ?url

// 타이밍
const BOX_MS = 2000; // 박스(비디오) 확장 시간
const MOVE_MS = 500; // 로고가 상단으로 이동하는 시간
const TOTAL_MS = BOX_MS + MOVE_MS;

// 중앙 로고 스케일 (박스 단계에서 크게 보였다가 이동하며 1로 축소)
const CENTRAL_SCALE = 2;

// 로고 상단 도착 시 비디오를 어둡게 덮는 오버레이 투명도(0=투명, 1=완전검정)
const DARK_OVERLAY_OPACITY = 0.8;

const BlinkCaret = () => (
  <motion.span
    aria-hidden
    className="ml-0.5 inline-block h-[1em] w-[2px] bg-[#23272E] align-[-0.2em]"
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
  />
);

type CategoryKey = "spending" | "life" | "saving" | "growth";

export default function Splash({
  onDone,
  onSelectCategory,
  nextLabel = "대화하기",
}: {
  onDone?: () => void;
  onSelectCategory?: (key: CategoryKey) => void;
  nextLabel?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  // 단계별 상태
  const [boxDone, setBoxDone] = useState(prefersReducedMotion); // 박스가 화면을 꽉 채웠는가
  const [showMain, setShowMain] = useState(prefersReducedMotion); // 로고가 헤더 도착 → 본문 표시
  const [canType, setCanType] = useState(prefersReducedMotion); // 타이핑 시작(본문 표시와 동시에)

  // 타임라인: BOX_MS가 끝나면 로고 이동 시작, MOVE_MS 후 showMain
  useEffect(() => {
    if (prefersReducedMotion) return;
    const t1 = setTimeout(() => setBoxDone(true), BOX_MS);
    const t2 = setTimeout(() => {
      setShowMain(true);
      setCanType(true);
    }, TOTAL_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [prefersReducedMotion]);

  // ── 타이핑 ───────────────────────────
  const fullText = useMemo(
    () =>
      "안녕하세요! 저는 메멘토의 AI 도우미 ‘토리’예요.\n저와 함께 멘티님에게 딱 맞는 멘토링을 찾아볼까요?",
    [],
  );
  const [typed, setTyped] = useState("");
  const typeIndexRef = useRef(0);

  useEffect(() => {
    if (!canType) return;
    if (prefersReducedMotion) {
      setTyped(fullText);
      return;
    }
    let timer: number | undefined;
    const step = () => {
      typeIndexRef.current += 1;
      setTyped(fullText.slice(0, typeIndexRef.current));
      if (typeIndexRef.current < fullText.length) {
        timer = window.setTimeout(step, 50);
      }
    };
    timer = window.setTimeout(step, 200);
    return () => timer && clearTimeout(timer);
  }, [canType, fullText, prefersReducedMotion]);

  const fadeUp: MotionProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  };

  const categories = [
    { key: "spending", label: "소비패턴", Icon: CreditCard },
    { key: "life", label: "생활노하우", Icon: Lightbulb },
    { key: "saving", label: "저축방식", Icon: PiggyBank },
    { key: "growth", label: "자산증식", Icon: LineChart },
  ];

  return (
    <div
      className="relative flex h-dvh w-dvw flex-col overflow-hidden bg-transparent"
      role="region"
      aria-label="메멘토 스플래시">
      {/* ===== 1) 비디오 박스: 중앙에서 시작 → 화면을 꽉 채울 때까지 확대 ===== */}
      <motion.div
        // 박스(비디오) 컨테이너. 처음엔 가운데 작은 라운드 박스, 점점 커져서 전체 화면을 채움
        className="fixed top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-black/10"
        style={{ boxShadow: "0 30px 70px rgba(0,0,0,0.25)" }}
        initial={{ width: "42vw", height: "22vh", borderRadius: 24 }}
        animate={{
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : BOX_MS / 1000,
          ease: [0.2, 0.9, 0.2, 1],
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
      </motion.div>

      {/* ===== 2) 로고: 박스가 꽉 찬 뒤에만 중앙에서 상단(헤더 자리)으로 이동 ===== */}
      {!prefersReducedMotion && (
        <motion.div
          className="fixed left-1/2 z-40 flex -translate-x-1/2 justify-center"
          style={{ top: "3vh" }} // 최종 헤더 자리 기준
          initial={{ y: "40vh", scale: CENTRAL_SCALE, opacity: 1 }}
          animate={{
            // boxDone 전에는 중앙에 멈춰 있음. boxDone 후 MOVE_MS 동안 40vh → 0vh 이동 + 스케일 축소
            y: boxDone ? "0vh" : "40vh",
            scale: boxDone ? 1 : CENTRAL_SCALE,
            opacity: 1,
          }}
          transition={{
            duration: boxDone ? MOVE_MS / 1000 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}>
          <img
            src={mementoLogo}
            alt="memento logo intro"
            className="h-auto w-[136px] sm:w-[160px] md:w-[180px]"
          />
        </motion.div>
      )}

      {/* ===== 3) 비디오 어둡게: 로고가 헤더 도착(showMain)하면 오버레이로 어둡게 덮기 ===== */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: showMain ? DARK_OVERLAY_OPACITY : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ backgroundColor: "#000" }}
      />

      {/* ===== 4) 본 화면 (곰돌이/버튼/말풍선/카테고리) — 로고 도착 즉시 표시 ===== */}
      <motion.div
        className="relative z-30 flex h-full flex-col"
        initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
        animate={{ opacity: showMain ? 1 : 0 }}
        transition={{ duration: 0.001 }} // 딜레이/페이드 없이 바로 뜨게
      >
        {/* ---------------- Mobile ---------------- */}
        <div className="flex flex-1 flex-col md:hidden">
          {/* 카테고리 */}
          <motion.nav className="mt-20 flex w-full items-center justify-center px-4" {...fadeUp}>
            <div className="grid w-full max-w-[860px] grid-cols-2 gap-2 rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-black/5 backdrop-blur">
              {categories.map(({ key, label, Icon }) => (
                <button
                  key={key as string}
                  type="button"
                  onClick={() => onSelectCategory?.(key as CategoryKey)}
                  className="group inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200/70 bg-blue-50 px-3 py-2 text-[12px] font-medium text-blue-700 shadow-sm transition hover:-translate-y-[1px] hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                  aria-label={label}>
                  <Icon className="h-4 w-4 opacity-80 group-hover:opacity-100" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </motion.nav>

          {/* 말풍선 + 곰돌이 */}
          <div className="flex flex-1 items-center justify-center px-4">
            <div className="flex w-full flex-col items-center justify-center gap-4 sm:gap-5">
              <motion.div
                className="z-10 w-[92%] rounded-2xl border border-black/5 bg-white/90 px-4 py-4 text-center shadow-md backdrop-blur"
                {...fadeUp}>
                <p className="text-[14px] leading-6 break-words break-keep whitespace-pre-line text-[#23272E]">
                  {typed}
                  <BlinkCaret />
                </p>
                <div className="mx-auto mt-2 h-2.5 w-2.5 rotate-45 rounded-[4px] border-t border-l border-black/5 bg-white/90" />
              </motion.div>

              <div className="z-10 flex justify-center">
                <motion.img
                  src={characterGom}
                  alt="메멘토 캐릭터 토리"
                  className="h-auto w-[60%] max-w-[300px]"
                  animate={canType ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <motion.div className="z-10 mb-4 flex justify-center gap-2 px-4" {...fadeUp}>
            <button
              type="button"
              onClick={onDone}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#3B82F6] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2563EB] active:scale-[0.98]"
              aria-label="대화하기">
              {nextLabel}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onDone}
              className="rounded-2xl bg-transparent px-3.5 py-2 text-xs text-[#3B82F6] underline-offset-4 hover:underline"
              aria-label="건너뛰기">
              건너뛰기
            </button>
          </motion.div>
        </div>

        {/* ---------------- Desktop ---------------- */}
        <div className="hidden flex-1 grid-cols-12 items-center gap-6 px-6 pt-24 md:grid">
          {/* 왼쪽: 곰돌이 + 말풍선 */}
          <div className="col-span-7 flex items-end justify-center">
            <div className="relative w-full max-w-[300px]">
              <motion.div
                className="absolute bottom-[calc(100%+12px)] left-1/2 z-10 w-[92%] max-w-[520px] -translate-x-1/2 rounded-2xl border border-black/5 bg-white/90 px-5 py-4 text-center shadow-md backdrop-blur"
                {...fadeUp}>
                <p className="text-[15px] leading-7 whitespace-pre-line text-[#23272E]">
                  {typed}
                  <BlinkCaret />
                </p>
                <div className="mx-auto mt-2 h-3 w-3 rotate-45 rounded-[4px] border-t border-l border-black/5 bg-white/90" />
              </motion.div>

              <motion.img
                src={characterGom}
                alt="메멘토 캐릭터 토리"
                className="z-0 h-auto w-full max-w-[520px]"
                animate={canType ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* 오른쪽: 카테고리 + 버튼 */}
          <div className="col-span-5 flex h-full flex-col items-stretch justify-center gap-5">
            <motion.nav className="w-full" {...fadeUp} aria-label="빠른 시작 카테고리">
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white/70 p-3 shadow-sm ring-1 ring-black/5 backdrop-blur">
                {categories.map(({ key, label, Icon }) => (
                  <button
                    key={key as string}
                    type="button"
                    onClick={() => onSelectCategory?.(key as CategoryKey)}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200/70 bg-blue-50 px-4 py-3 text-[13px] font-medium text-blue-700 shadow-sm transition hover:-translate-y-[1px] hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                    aria-label={label}>
                    <Icon className="h-4 w-4 opacity-80 group-hover:opacity-100" />
                    <span className="truncate">{label}</span>
                  </button>
                ))}
              </div>
            </motion.nav>

            <motion.div className="flex w-full items-center gap-3" {...fadeUp}>
              <button
                type="button"
                onClick={onDone}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2563EB] active:scale-[0.98]"
                aria-label="대화하기">
                {nextLabel}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onDone}
                className="rounded-2xl px-4 py-3 text-sm text-[#3B82F6] underline-offset-4 hover:underline"
                aria-label="건너뛰기">
                건너뛰기
              </button>
            </motion.div>
          </div>
        </div>

        <span className="sr-only" role="status">
          메멘토 스플래시 화면입니다. 비디오가 박스 안에서 시작해 전체 화면으로 확장되고, 그 다음
          로고가 헤더로 이동합니다. 로고 도착 즉시 화면이 나타나며 배경은 어두워집니다.
        </span>
      </motion.div>
    </div>
  );
}
