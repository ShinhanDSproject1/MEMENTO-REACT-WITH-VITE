// src/pages/ChatPage.tsx
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import characterGom from "@shared/assets/images/character/character-main-sit.png";

// ===== 타입 =====
type AssistantMessage = { id: string; content: string; createdAt: number };
type QuickChip = { label: string; text: string };

// ===== 유틸 =====
const uid = () => Math.random().toString(36).slice(2);
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ===== 토리 말풍선 (밤하늘 글라스 스타일) =====
function ToriBubble({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[
        "relative max-w-[720px] rounded-2xl px-4 py-3 text-[14px] leading-7",
        "backdrop-blur-md",
        "bg-white/10 text-black",
        "shadow-[0_8px_24px_rgba(0,0,0,0.25)] ring-1 ring-white/15",
      ].join(" ")}>
      {children}
      <div
        className="absolute top-full left-6 h-3 w-3 -translate-y-[6px] rotate-45 rounded-sm bg-white/10 ring-1 ring-white/15"
        aria-hidden
      />
    </div>
  );
}

export default function ChatPage() {
  const { sessionId = "1" } = useParams();
  const prefersReducedMotion = useReducedMotion();

  // 토리 메시지 스택 (유저 버블은 표시 안함)
  const [assistantMsgs, setAssistantMsgs] = useState<AssistantMessage[]>(() => [
    {
      id: uid(),
      content:
        "나는 앞으로 너와 함께할 ‘토리’야.\n지금 네 마음이나 궁금한 걸 알려주면,\n그 감정과 상황에 맞는 멘토링을 추천해줄게!",
      createdAt: Date.now(),
    },
  ]);

  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [typing, setTyping] = useState(false);

  // 스크롤 컨테이너
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [assistantMsgs.length, typing]);

  // 전송
  const sendMessage = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || pending) return;

      setPending(true);
      try {
        setTyping(true);

        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            messages: [
              ...assistantMsgs.slice(-12).map((m) => ({ role: "assistant", content: m.content })),
              { role: "user", content: question },
            ],
          }),
        });

        if (!res.ok) throw new Error(`AI 서버 응답 오류(${res.status})`);
        const data = (await res.json()) as { reply?: string };
        const reply = data?.reply ?? "지금은 답변이 어려워. 잠시 후 다시 시도해줘.";

        await delay(prefersReducedMotion ? 0 : 220);
        setAssistantMsgs((prev) => [...prev, { id: uid(), content: reply, createdAt: Date.now() }]);
      } catch (e) {
        setAssistantMsgs((prev) => [
          ...prev,
          {
            id: uid(),
            content: "앗, 바람이 거세네…(서버 연결 문제)\n잠시 뒤 다시 얘기해볼까?",
            createdAt: Date.now(),
          },
        ]);
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setTyping(false);
        setPending(false);
        setInput("");
      }
    },
    [assistantMsgs, pending, prefersReducedMotion, sessionId],
  );

  // 엔터 전송
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.keyCode === 13) && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // 모션
  const fadeUp = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45 },
      };

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* 밤하늘 배경 */}
      <div
        aria-hidden
        className={[
          "absolute inset-0 -z-10",
          "bg-[radial-gradient(60%_60%_at_50%_30%,#2C2F59_0%,#1E2047_45%,#12142F_80%)]",
        ].join(" ")}
      />
      {/* 별빛(가벼운 파티클) */}
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.2} 50%{opacity:1} }
      `}</style>
      <div className="pointer-events-none absolute inset-0 -z-10">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-white/80"
            style={{
              top: `${Math.random() * 70}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 2}s ease-in-out ${Math.random()}s infinite`,
              opacity: 0.35,
            }}
          />
        ))}
      </div>
      {/* 지면 실루엣 */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 z-0 h-[34vh] w-[140%] -translate-x-1/2 rounded-[9999px] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(9,10,20,0.35)_30%,rgba(6,7,16,0.7)_60%,#04050D_100%)] shadow-[0_-20px_60px_rgba(6,8,20,.6)]"
      />

      {/* 한 화면 폭을 넘지 않도록 중앙 컨테이너 고정 */}
      <div className="mx-auto grid h-full max-w-[860px] grid-rows-[1fr_auto] px-3">
        {/* 타임라인(스크롤) */}
        <div
          ref={scrollRef}
          className="no-scrollbar relative z-10 flex flex-col gap-3 overflow-y-auto py-4">
          {/* 상단 여백으로 말풍선이 곰 위에 쌓이는 느낌 */}
          <div className="h-4" aria-hidden />
          {/* 추천 칩 (첫 화면에서만 강조) */}
          {assistantMsgs.length <= 1 && (
            <motion.div {...fadeUp} className="mb-1 flex flex-wrap gap-2">
              {(
                [
                  { label: "기분 가라앉음", text: "오늘 좀 우울해. 동기부여가 필요해." },
                  { label: "소비가 걱정", text: "요즘 충동구매가 늘었어. 어떻게 줄일까?" },
                  { label: "저축 루틴", text: "월급에서 현실적인 저축 비율을 알려줘." },
                  { label: "멘토 추천", text: "나한테 맞는 멘토링 클래스를 추천해줘." },
                ] as QuickChip[]
              ).map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => sendMessage(q.text)}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/90 backdrop-blur hover:bg-white/15">
                  {q.label}
                </button>
              ))}
            </motion.div>
          )}

          {assistantMsgs.map((m) => (
            <motion.div key={m.id} {...fadeUp} className="flex w-full justify-start">
              <ToriBubble>{m.content}</ToriBubble>
            </motion.div>
          ))}

          {typing && (
            <div className="mt-1 flex items-center gap-2 text-[13px] text-white/70">
              <Loader2 className="size-3.5 animate-spin" />
              토리 입력중…
            </div>
          )}

          {/* 곰(항상 하단 중앙, 살짝 호흡 애니메이션) */}
          <div className="pointer-events-none relative z-0 mt-6 flex w-full items-end justify-center pb-[22vh]">
            <motion.img
              src={characterGom}
              alt="토리"
              className="h-auto w-[140px] sm:w-[160px]"
              animate={prefersReducedMotion ? {} : { scale: [1, 1.02, 1] }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              }
            />
          </div>
        </div>

        {/* 하단 입력 바 */}
        <div className="relative z-10 mb-4 grid grid-cols-[1fr_auto] items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
          <input
            type="text"
            placeholder="지금 마음이나 상황을 말해줘. (예: 오늘 집중이 안 돼…)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="h-10 w-full bg-transparent text-[14px] text-white outline-none placeholder:text-white/50"
          />
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={pending || !input.trim()}
            className={[
              "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition",
              pending || !input.trim()
                ? "cursor-not-allowed bg-white/10 text-white/50"
                : "bg-white text-[#1C1F3D] hover:bg-white/90",
            ].join(" ")}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            <span className="hidden sm:inline">{pending ? "전송중…" : "전송"}</span>
          </button>
        </div>
      </div>

      {/* 접근성 안내 */}
      <span className="sr-only">
        밤하늘 배경 위에서 토리가 말풍선으로 대화합니다. 입력창은 하단에 있습니다.
      </span>
    </div>
  );
}
