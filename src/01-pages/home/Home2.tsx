// src/widgets/splash/Splash.tsx
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  Eye,
  EyeOff,
  Lightbulb,
  LineChart,
  PiggyBank,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import characterGom from "@shared/assets/images/character/character-gom-blue.png";
import mementoLogo from "@shared/assets/images/logo/memento-logo.svg";

/* ---------------- Types & Const ---------------- */

type CategoryKey = "spending" | "life" | "saving" | "growth";
type Role = "mentee" | "mentor";

const BOX_MS = 2000;
const MOVE_MS = 500;
const TOTAL_MS = BOX_MS + MOVE_MS;
const CENTRAL_SCALE = 2;

const CATEGORY_MAP: Record<CategoryKey, number> = {
  spending: 1,
  life: 2,
  saving: 3,
  growth: 4,
};

const BlinkCaret = () => (
  <motion.span
    aria-hidden
    className="ml-1 inline-block h-[1em] w-[2px] bg-[#23272E] align-[-0.2em]"
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
  />
);

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
  const navigate = useNavigate();

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
    onLogin?.(email.trim(), pw, role);
  };

  // 모바일: 폼 모달 & 메뉴
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[60] flex h-screen w-screen flex-col overflow-hidden bg-gradient-to-br from-white to-gray-50"
      role="region"
      aria-label="메멘토 스플래시">
      {/* 로고 이동 */}
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

      {/* 본 화면 */}
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
            <span className="inline-flex cursor-default items-center gap-2 rounded-full px-5 py-2.5 text-[16px] font-bold text-[#23272E]">
              금융멘토링 주제별로 살펴보기
            </span>
            {categories.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => onSelectCategory?.(key)}
                className="group relative inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-[16px] font-bold text-[#23272E] transition-colors duration-200 hover:text-[#3B82F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:text-[#2563EB]">
                <Icon className="h-5 w-5 text-current opacity-90 transition-colors duration-200 group-hover:text-[#3B82F6] group-active:text-[#2563EB]" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </motion.nav>

        {/* 모바일: 로고 밑 카테고리 타이틀 + 버튼 4개 */}
        <div className="fixed top-[58px] right-0 left-0 z-50 flex flex-col items-center gap-1 px-3 md:hidden">
          <span className="mb-1 text-[13px] font-semibold text-[#1E3A8A]">멘토링 카테고리</span>
          <div className="flex w-full justify-center gap-2">
            {categories.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => navigate(`/menti/${CATEGORY_MAP[key]}`)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-3 py-2 text-[10px] font-semibold text-white shadow-md transition hover:bg-[#2563EB] active:scale-[0.98]">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ---------------- Mobile 본문 ---------------- */}
        <div className="flex flex-1 flex-col md:hidden">
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
                </div>
                <div className="mx-auto mt-2 h-2.5 w-2.5 rotate-45 rounded-[4px] border-t border-l border-black/5 bg-white/92" />
              </motion.div>

              {/* 곰돌이 + 글로우 */}
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

          {/* 모바일: 하단 추천 + 로그인 버튼 (파랑 계열) */}
          <div className="pointer-events-none relative z-30 mb-6 flex w-full flex-col gap-4 px-4">
            {/* 추천받기 버튼 - 연한 파랑 */}
            {typedDone && (
              <button
                type="button"
                onClick={() => onDone?.("추천받기")}
                className="pointer-events-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#60A5FA] px-5 py-3 text-[15px] font-semibold text-white shadow-md transition hover:bg-[#3B82F6] active:scale-[0.99]">
                추천받기
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {/* 로그인 버튼 - 진한 파랑 */}
            <button
              type="button"
              onClick={() => setMobileLoginOpen(true)}
              className="pointer-events-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-[15px] font-semibold text-white shadow-md transition hover:bg-[#1D4ED8] active:scale-[0.99]">
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
              className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 backdrop-blur-[2px]">
              <motion.div
                initial={{ y: 32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="w-full max-w-[640px] rounded-t-2xl bg-white p-5 shadow-2xl">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[16px] font-bold text-[#111]">로그인</h3>
                  <button
                    aria-label="모달 닫기"
                    onClick={() => setMobileLoginOpen(false)}
                    className="rounded-lg p-1.5 text-[#666] hover:bg-black/5 active:scale-95">
                    <X className="h-5 w-5" />
                  </button>
                </div>

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

        {/* ---------------- Desktop 본문 ---------------- */}
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
                </div>
                <div className="mx-auto mt-2 h-3 w-3 rotate-45 rounded-[4px] border-t border-l border-black/5 bg-white/92" />
              </motion.div>

              {/* 글로우 */}
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
                className="w/full z-30 mx-auto block h-auto max-w-[300px]"
              />
            </div>
          </div>

          {/* 오른쪽: 로그인 폼 */}
          <div className="col-span-5 flex h-full flex-col items-stretch justify-center gap-5 md:-translate-x-3 lg:-translate-x-25">
            <motion.form
              onSubmit={handleLoginSubmit}
              className="mx-auto w-full max-w-[560px] rounded-2xl border border-white/15 bg-white/95 px-5 py-5 shadow-lg backdrop-blur"
              {...fadeUp}>
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
          메멘토 스플래시 화면입니다. 소개 문구가 출력된 뒤 상단 네비와 본문이 보입니다.
        </span>
      </motion.div>
    </div>
  );
}
