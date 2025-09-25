// src/widgets/splash/Splash.tsx
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  Eye,
  EyeOff,
  Lightbulb,
  LineChart,
  Menu,
  PiggyBank,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import characterGom from "@shared/assets/images/character/character-gom-blue.png";
import mementoLogo from "@shared/assets/images/logo/memento-logo.svg";
import bgVideo from "@shared/assets/video/mainVideo3.mp4";

const BOX_MS = 2000;
const MOVE_MS = 500;
const TOTAL_MS = BOX_MS + MOVE_MS;

const CENTRAL_SCALE = 2;
const DARK_OVERLAY_OPACITY = 0.8;
const BORDER_WIDTH = 10;
const BORDER_OPACITY = 0.7;

const BlinkCaret = () => (
  <motion.span
    aria-hidden
    className="ml-1 inline-block h-[1em] w-[2px] bg-[#23272E] align-[-0.2em]"
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
  />
);

type CategoryKey = "spending" | "life" | "saving" | "growth";
type Role = "mentee" | "mentor";

export default function Splash({
  onDone,
  onSelectCategory,
  onLogin,
  nextLabel = "대화하기",
}: {
  onDone?: (message?: string) => void;
  onSelectCategory?: (key: CategoryKey) => void;
  onLogin?: (email: string, password: string, role?: Role) => void;
  nextLabel?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  // 애니 단계
  const [boxDone, setBoxDone] = useState(prefersReducedMotion);
  const [showMain, setShowMain] = useState(prefersReducedMotion);
  const [canType, setCanType] = useState(prefersReducedMotion);

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

  // 타이핑
  const fullText = useMemo(
    () =>
      "안녕하세요! 저는 메멘토의 AI 도우미 ‘토리’예요.\n저와 함께 멘티님에게 딱 맞는 멘토링을 찾아볼까요?",
    [],
  );
  const [typed, setTyped] = useState("");
  const [typedDone, setTypedDone] = useState(prefersReducedMotion);
  const typeIndexRef = useRef(0);

  useEffect(() => {
    if (!canType) return;
    if (prefersReducedMotion) {
      setTyped(fullText);
      setTypedDone(true);
      return;
    }
    let timer: number | undefined;
    const step = () => {
      typeIndexRef.current += 1;
      const next = fullText.slice(0, typeIndexRef.current);
      setTyped(next);
      if (typeIndexRef.current < fullText.length) {
        timer = window.setTimeout(step, 50);
      } else {
        setTypedDone(true);
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
  ] as const;

  // 로그인 상태
  const [role, setRole] = useState<Role>("mentee");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onLogin) onLogin(email.trim(), pw, role);
  };

  // 모바일 전용: 폼 모달
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);

  // 메뉴
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[60] flex h-screen w-screen flex-col overflow-hidden bg-transparent"
      role="region"
      aria-label="메멘토 스플래시">
      {/* 1) 비디오 박스 */}
      <motion.div
        className="fixed top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-black/10"
        style={{
          boxShadow: "0 30px 70px rgba(0,0,0,0.25)",
          borderStyle: "solid",
          borderWidth: BORDER_WIDTH,
          borderColor: `rgba(0,0,0,${BORDER_OPACITY})`,
          WebkitMaskImage: "radial-gradient(white, black)",
        }}
        initial={{ width: "42vw", height: "22vh", borderRadius: 24 }}
        animate={{ width: "100vw", height: "100vh", borderRadius: 0 }}
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

      {/* 2) 로고 이동 */}
      {!prefersReducedMotion && (
        <div className="fixed z-40" style={{ left: "6vw", top: "3vh" }}>
          <motion.div
            initial={{ x: "44vw", y: "47vh", scale: CENTRAL_SCALE, opacity: 1 }}
            animate={{
              x: boxDone ? 0 : "44vw",
              y: boxDone ? 0 : "47vh",
              scale: boxDone ? 1 : CENTRAL_SCALE,
              opacity: 1,
            }}
            transition={{ duration: boxDone ? MOVE_MS / 1000 : 0, ease: [0.22, 1, 0.36, 1] }}>
            <img
              src={mementoLogo}
              alt="memento logo intro"
              className="h-auto w-[110px] sm:w-[150px] md:w-[180px]"
            />
          </motion.div>
        </div>
      )}

      {/* 3) 어둡게 오버레이 */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: showMain ? DARK_OVERLAY_OPACITY : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ backgroundColor: "#000" }}
      />

      {/* 4) 본 화면 */}
      <motion.div
        className="relative z-30 flex h-full flex-col"
        initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
        animate={{ opacity: showMain ? 1 : 0 }}
        transition={{ duration: 0.001 }}>
        {/* 상단 카테고리 (데스크톱) */}
        <motion.nav
          className="fixed top-3 right-[12vw] z-40 hidden w-auto px-2 sm:top-4 md:block lg:right-[18vw]"
          {...fadeUp}
          aria-label="빠른 시작 카테고리">
          <div className="flex flex-wrap items-center justify-end gap-3">
            <span className="inline-flex cursor-default items-center gap-2 rounded-full px-5 py-2.5 text-[16px] font-bold text-white/95">
              금융멘토링 주제별로 살펴보기
            </span>
            {categories.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => onSelectCategory?.(key)}
                className="group relative inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-[16px] font-bold text-white/95 transition-colors duration-200 hover:text-[#3B82F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:text-[#2563EB]">
                <Icon className="h-5 w-5 text-current opacity-90 transition-colors duration-200 group-hover:text-[#3B82F6] group-active:text-[#2563EB]" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </motion.nav>

        {/* 모바일: 햄버거 */}
        <div className="fixed top-2 right-2 z-40 md:hidden">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-xl bg-black/20 p-2 text-white ring-1 ring-white/10 backdrop-blur-sm active:scale-95">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <motion.div
            initial={false}
            animate={{
              opacity: menuOpen ? 1 : 0,
              y: menuOpen ? 0 : -6,
              pointerEvents: menuOpen ? "auto" : "none",
            }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2 w-[58vw] max-w-[320px] min-w-[220px] overflow-hidden rounded-2xl p-1.5 text-white ring-1 ring-white/10 backdrop-blur-md"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
            {categories.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onSelectCategory?.(key);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[14px] font-semibold hover:bg-white/10 active:scale-[0.99]">
                <Icon className="h-4 w-4 opacity-90" />
                <span>{label}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* 좌하단 슬로건 (데스크톱) */}
        <div className="fixed bottom-10 left-[6vw] z-40 hidden text-white md:block" aria-hidden>
          <h2 className="text-[40px] leading-snug font-extrabold drop-shadow-md">
            더 쉽고 편안한, 더 친근한 금융멘토링
          </h2>
          <p className="mt-1 text-[20px] font-medium opacity-90 drop-shadow">
            당신의 올바른 금융습관, 메멘토와 함께 하세요.
          </p>
        </div>

        {/* ---------------- Mobile ---------------- */}
        <div className="flex flex-1 flex-col md:hidden">
          {/* 말풍선 + 곰돌이 + 발판 + 글로우 */}
          <div className="flex flex-1 items-center justify-center px-4">
            <div className="flex w-full flex-col items-center justify-center gap-4 sm:gap-5">
              {/* 말풍선 */}
              <motion.div
                className="z-10 w-[98%] max-w-[780px] rounded-2xl border border-black/5 bg-white/92 px-4 py-4 shadow-md backdrop-blur"
                {...fadeUp}>
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <p className="flex-1 text-left text-[14px] leading-6 break-words break-keep whitespace-pre-line text-[#23272E]">
                    {typed}
                    {!typedDone && <BlinkCaret />}
                  </p>
                  {typedDone && (
                    <button
                      type="button"
                      onClick={() => onDone?.("추천받기")}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#2563EB] active:scale-[0.98]">
                      추천받기
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="mx-auto mt-2 h-2.5 w-2.5 rotate-45 rounded-[4px] border-t border-l border-black/5 bg-white/92" />
              </motion.div>

              {/* 곰돌이 + 파란 글로우 + 발판 */}
              <div className="relative z-10 flex justify-center">
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-[-6%] -z-10 rounded-full"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(59,130,246,0.48), rgba(59,130,246,0.22) 52%, rgba(59,130,246,0) 70%)",
                    filter: "blur(22px)",
                  }}
                  animate={{ scale: [1, 1.06, 1], opacity: [0.9, 1, 0.9] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 rounded-full"
                  style={{
                    bottom: 10,
                    width: "64%",
                    maxWidth: 360,
                    height: 24,
                    background:
                      "radial-gradient(50% 60% at 50% 50%, rgba(173, 216, 230, 0.6), rgba(255,255,255,0.35) 60%, rgba(255,255,255,0) 100%)",
                    opacity: 1,
                  }}
                />
                <img
                  src={characterGom}
                  alt="메멘토 캐릭터 토리"
                  className="z-30 h-auto w-[54%] max-w-[260px]"
                />
              </div>
            </div>
          </div>

          {/* 모바일: 하단 폼 제거 → 버튼으로 모달 오픈 */}
          <div className="pointer-events-none relative z-30 mb-4 flex w-full items-center justify-center">
            <button
              type="button"
              onClick={() => setMobileLoginOpen(true)}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-xl bg-white/95 px-5 py-3 text-[15px] font-semibold text-[#111] shadow-lg ring-1 ring-black/10 backdrop-blur hover:bg-white">
              로그인
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* 모바일 전용 로그인 모달 */}
          {mobileLoginOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-[2px]">
              <motion.div
                initial={{ y: 32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="w-full max-w-[640px] rounded-t-2xl bg-white p-5 shadow-2xl">
                {/* 상단 바 */}
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[16px] font-bold text-[#111]">로그인</h3>
                  <button
                    aria-label="모달 닫기"
                    onClick={() => setMobileLoginOpen(false)}
                    className="rounded-lg p-1.5 text-[#666] hover:bg-black/5 active:scale-95">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* 역할 선택 (멘토/멘티) */}
                <div className="mb-4 flex gap-2">
                  {[
                    { k: "mentee", label: "멘티" },
                    { k: "mentor", label: "멘토" },
                  ].map(({ k, label }) => {
                    const active = role === (k as Role);
                    return (
                      <button
                        key={k}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setRole(k as Role)}
                        className={`flex-1 rounded-xl px-4 py-2.5 text-[14px] font-semibold ring-1 transition ${
                          active
                            ? "bg-[#3B82F6] text-white ring-[#3B82F6]"
                            : "bg-white text-[#111] ring-black/10 hover:bg-black/5"
                        }`}>
                        {label} 로그인
                      </button>
                    );
                  })}
                </div>

                {/* 폼 */}
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
                  <label className="text-[13px] font-semibold text-[#222]">
                    ID :
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일을 입력하세요"
                      autoComplete="email"
                      inputMode="email"
                      className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-3.5 text-[16px] text-[#111] placeholder:text-[#666] focus:outline-none"
                    />
                  </label>

                  <label className="text-[13px] font-semibold text-[#222]">
                    PW :
                    <div className="relative mt-1">
                      <input
                        type={showPw ? "text" : "password"}
                        required
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        placeholder="비밀번호를 입력하세요"
                        autoComplete="current-password"
                        enterKeyHint="done"
                        className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-3.5 pr-10 text-[16px] text-[#111] placeholder:text-[#666] focus:outline-none"
                      />
                      <button
                        type="button"
                        aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-2 text-[#555] hover:text-[#111]">
                        {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </label>

                  <button
                    type="submit"
                    className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-3.5 text-[16px] font-semibold text-white shadow-sm transition hover:bg-[#2563EB] active:scale-[0.99]">
                    로그인
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* ---------------- Desktop ---------------- */}
        <div className="hidden flex-1 grid-cols-12 items-center gap-6 px-6 pt-24 md:grid">
          {/* 왼쪽: 말풍선 + 곰돌이 */}
          <div className="col-span-7 flex items-end justify-center">
            <div className="relative w-full max-w-[500px]">
              <motion.div
                className="absolute bottom-[calc(100%+12px)] left-1/2 z-10 w-[100%] max-w-[500px] -translate-x-1/2 rounded-2xl border border-black/5 bg-white/92 px-5 py-4 shadow-md backdrop-blur"
                {...fadeUp}>
                <div className="flex items-center justify-between gap-4">
                  <p className="flex-1 text-left text-[15px] leading-7 whitespace-pre-line text-[#23272E]">
                    {typed}
                    {!typedDone && <BlinkCaret />}
                  </p>
                  {typedDone && (
                    <button
                      type="button"
                      onClick={() => onDone?.("추천받기")}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#2563EB] active:scale-[0.98]">
                      추천받기
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="mx-auto mt-2 h-3 w-3 rotate-45 rounded-[4px] border-t border-l border-black/5 bg-white/92" />
              </motion.div>

              {/* 파란 글로우 */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(59,130,246,0.46), rgba(59,130,246,0.2) 52%, rgba(59,130,246,0) 72%)",
                  filter: "blur(26px)",
                }}
                animate={{ scale: [1, 1.06, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* 발판 */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 rounded-full"
                style={{
                  bottom: 40,
                  width: "100%",
                  maxWidth: 360,
                  height: 24,
                  background:
                    "radial-gradient(50% 60% at 50% 50%, rgba(173, 216, 230, 0.6), rgba(255,255,255,0.35) 60%, rgba(255,255,255,0) 100%)",
                  opacity: 1,
                }}
              />
              <img
                src={characterGom}
                alt="메멘토 캐릭터 토리"
                className="z-30 mx-auto block h-auto w-full max-w-[300px]"
              />
            </div>
          </div>

          {/* 오른쪽: 로그인 폼 (데스크톱) */}
          <div className="col-span-5 flex h-full flex-col items-stretch justify-center gap-5 md:-translate-x-3 lg:-translate-x-25">
            <motion.form
              onSubmit={handleLoginSubmit}
              className="mx-auto w-full max-w-[560px] rounded-2xl border border-white/15 bg-white/95 px-5 py-5 shadow-lg backdrop-blur"
              {...fadeUp}>
              {/* 역할 선택 */}
              <div className="mb-2 flex gap-2">
                {[
                  { k: "mentee", label: "멘티" },
                  { k: "mentor", label: "멘토" },
                ].map(({ k, label }) => {
                  const active = role === (k as Role);
                  return (
                    <button
                      key={k}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setRole(k as Role)}
                      className={`flex-1 rounded-xl px-4 py-2.5 text-[14px] font-semibold ring-1 transition ${
                        active
                          ? "bg-[#3B82F6] text-white ring-[#3B82F6]"
                          : "bg-white text-[#111] ring-black/10 hover:bg-black/5"
                      }`}>
                      {label} 로그인
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-[14px] font-semibold text-[#222]">
                  ID :
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    autoComplete="email"
                    inputMode="email"
                    className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-3 text-[15px] text-[#111] placeholder:text-[#666] focus:outline-none"
                  />
                </label>

                <label className="text-[14px] font-semibold text-[#222]">
                  PW :
                  <div className="relative mt-1">
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-black/10 bg-transparent px-3 py-3 pr-10 text-[15px] text-[#111] placeholder:text-[#666] focus:outline-none"
                    />
                    <button
                      type="button"
                      aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-[#555] hover:text-[#111]">
                      {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#2563EB] active:scale-[0.99]">
                  로그인
                </button>
              </div>
            </motion.form>
          </div>
        </div>

        <span className="sr-only" role="status">
          메멘토 스플래시 화면입니다. 비디오가 박스 안에서 시작해 검은 테두리를 유지한 채 전체
          화면으로 확장되고, 이후 로고가 화면 중앙에서 왼쪽 상단 헤더 위치로 대각선으로 이동합니다.
          로고 도착 즉시 본 화면이 나타나며 배경은 어두워집니다.
        </span>
      </motion.div>
    </div>
  );
}
