// src/widgets/splash/Splash.tsx
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import { ArrowRight, CreditCard, Lightbulb, LineChart, PiggyBank } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import characterGom from "@shared/assets/images/character/character-main-sit.png";
import mementoLogo from "@shared/assets/images/logo/memento-logo.svg";

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
  autoAdvanceMs = 0,
  nextLabel = "대화하기",
}: {
  onDone?: () => void;
  onSelectCategory?: (key: CategoryKey) => void;
  autoAdvanceMs?: number;
  nextLabel?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  // ── 타이핑 텍스트 ───────────────────────────────────────────
  const fullText = useMemo(
    () =>
      "안녕하세요! 저는 메멘토의 AI 도우미 ‘토리’예요.\n저와함께 멘티님에게 딱 맞는 멘토링을 찾아볼까요?",
    [],
  );
  const [typed, setTyped] = useState("");
  const typeIndexRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setTyped(fullText);
      return;
    }

    // 기본 속도(사람이 읽기 편한 정도)
    const BASE = 60; // ms per char
    let timer: number | undefined;
    let raf = 0;

    const step = () => {
      typeIndexRef.current += 1; // 1글자씩
      setTyped(fullText.slice(0, typeIndexRef.current));

      if (typeIndexRef.current < fullText.length) {
        const nextChar = fullText[typeIndexRef.current] ?? "";
        // 문장부호/줄바꿈에서 약간 더 쉼
        const isPause = /[,.!?…]/.test(nextChar);
        const isNewline = nextChar === "\n";
        const delay = isNewline ? BASE + 260 : isPause ? BASE + 140 : BASE;

        raf = requestAnimationFrame(() => {
          timer = window.setTimeout(step, delay);
        });
      }
    };

    raf = requestAnimationFrame(() => {
      timer = window.setTimeout(step, 320); // 시작 전 살짝 지연
    });

    return () => {
      if (timer) window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [fullText, prefersReducedMotion]);

  // ── 자동 이동 (기본 OFF) ────────────────────────────────────
  useEffect(() => {
    if (!onDone || autoAdvanceMs <= 0) return;
    const t = setTimeout(onDone, autoAdvanceMs);
    return () => clearTimeout(t);
  }, [onDone, autoAdvanceMs]);

  // ── 모션 프리셋 (TS 안전) ───────────────────────────────────
  const fadeUp: MotionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }, // easeOut 유사
      };

  const categories: Array<{
    key: CategoryKey;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }> = [
    { key: "spending", label: "소비패턴", Icon: CreditCard },
    { key: "life", label: "생활노하우", Icon: Lightbulb },
    { key: "saving", label: "저축방식", Icon: PiggyBank },
    { key: "growth", label: "자산증식", Icon: LineChart },
  ];

  return (
    <div
      className="relative flex h-dvh w-dvw flex-col overflow-hidden bg-white"
      role="region"
      aria-label="메멘토 스플래시">
      {/* 배경 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(155,185,255,0.2)_0%,rgba(174,200,239,0.1)_35%,rgba(255,255,255,0)_70%)]"
      />
      <div
        aria-hidden
        className="absolute bottom-[-22vh] left-1/2 z-0 h-[58vh] w-[140%] -translate-x-1/2 rounded-[9999px] bg-gradient-to-t from-[#E9F0FF] to-white shadow-[0_-30px_60px_rgba(155,185,255,0.18)]"
      />

      {/* 상단 로고 */}
      <div className="flex justify-center pt-3 sm:pt-4">
        <motion.img
          src={mementoLogo}
          alt="memento logo"
          className="h-auto w-[136px] sm:w-[160px] md:w-[180px]"
          {...fadeUp}
        />
      </div>

      {/* 카테고리: 모바일 2×2, md 이상 가로 4개 */}
      <motion.nav
        className="mt-4 flex w-full items-center justify-center px-4"
        {...fadeUp}
        aria-label="빠른 시작 카테고리">
        <div className="grid w-full max-w-[860px] grid-cols-2 gap-2 rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-black/5 backdrop-blur md:grid-cols-4">
          {categories.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => onSelectCategory?.(key)}
              className="group inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200/70 bg-blue-50 px-3 py-2 text-[12px] font-medium text-blue-700 shadow-sm transition hover:-translate-y-[1px] hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 sm:text-[13px]"
              aria-label={label}>
              <Icon className="h-4 w-4 opacity-80 group-hover:opacity-100" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </motion.nav>

      {/* 중앙: 말풍선 + 캐릭터 */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="flex w-full max-w-[960px] flex-col items-center justify-center gap-4 sm:gap-5">
          {/* 말풍선 텍스트 (커서 항상 깜빡) */}
          <motion.div
            className="z-10 w-[92%] rounded-2xl border border-black/5 bg-white/90 px-4 py-4 text-center shadow-md backdrop-blur sm:w-auto sm:max-w-[720px] sm:rounded-3xl sm:px-6 sm:py-5"
            {...fadeUp}>
            <p className="text-[14px] leading-6 break-words break-keep whitespace-pre-line text-[#23272E] sm:text-[15px] sm:leading-7">
              {typed}
              <BlinkCaret />
            </p>
            <div className="mx-auto mt-2 h-2.5 w-2.5 rotate-45 rounded-[4px] border-t border-l border-black/5 bg-white/90 sm:h-3 sm:w-3" />
          </motion.div>

          {/* 캐릭터: 미세한 숨쉬기(스케일만) */}
          <div className="z-10 flex justify-center">
            <motion.img
              src={characterGom}
              alt="메멘토 캐릭터 토리"
              className="h-auto w-[100%] max-w-[200px] sm:w-[42%] sm:max-w-[240px] md:w-[50%] md:max-w-[300px]"
              animate={prefersReducedMotion ? {} : { scale: [1, 1.02, 1] }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              }
            />
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <motion.div className="z-10 mb-4 flex justify-center gap-2 px-4 sm:mb-6 sm:gap-3" {...fadeUp}>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#3B82F6] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2563EB] active:scale-[0.98] sm:px-5 sm:text-sm"
          aria-label="대화하기">
          {nextLabel}
          <ArrowRight className="h-4 w-4 sm:size-4" />
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-2xl bg-transparent px-3.5 py-2 text-xs text-[#3B82F6] underline-offset-4 hover:underline sm:px-4 sm:text-sm"
          aria-label="건너뛰기">
          건너뛰기
        </button>
      </motion.div>

      {/* 접근성 안내 */}
      <span className="sr-only" role="status">
        메멘토 스플래시 화면입니다. 토리가 인사말을 보여주는 중입니다.
      </span>
    </div>
  );
}
