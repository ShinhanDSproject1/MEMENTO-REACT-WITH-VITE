// src/pages/ChatPage.tsx
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import characterGom from "@shared/assets/images/character/character-main-sit.png";

type AssistantMessage = { id: string; content: string; createdAt: number };

const uid = () => Math.random().toString(36).slice(2);
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 말풍선 (화이트 배경 + 블랙 텍스트)
function ToriBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative max-w-[720px] rounded-2xl bg-white px-4 py-3 text-[14px] leading-7 text-black shadow-sm ring-1 ring-black/10">
      {children}
      <div
        className="absolute top-full left-6 h-3 w-3 -translate-y-[6px] rotate-45 rounded-sm bg-white ring-1 ring-black/10"
        aria-hidden
      />
    </div>
  );
}

export default function ChatPage() {
  const { sessionId = "1" } = useParams();
  const prefersReducedMotion = useReducedMotion();

  const [assistantMsgs, setAssistantMsgs] = useState<AssistantMessage[]>(() => [
    {
      id: uid(),
      content: "안녕하세요! 저는 메멘토의 AI 도우미 ‘토리’예요.\n궁금한 걸 편하게 입력해 주세요.",
      createdAt: Date.now(),
    },
  ]);

  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [typing, setTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [assistantMsgs.length, typing]);

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
        const reply = data?.reply ?? "지금은 답변이 어려워요. 잠시 후 다시 시도해주세요.";

        await delay(prefersReducedMotion ? 0 : 220);
        setAssistantMsgs((prev) => [...prev, { id: uid(), content: reply, createdAt: Date.now() }]);
      } catch (e) {
        setAssistantMsgs((prev) => [
          ...prev,
          {
            id: uid(),
            content: "앗, 서버와 연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요.",
            createdAt: Date.now(),
          },
        ]);
        console.error(e);
      } finally {
        setTyping(false);
        setPending(false);
        setInput("");
      }
    },
    [assistantMsgs, pending, prefersReducedMotion, sessionId],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.keyCode === 13) && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const fadeUp = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45 },
      };

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* 배경: 블루 그라디언트 */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#E8F1FF] to-[#C9E0FF]"
      />

      {/* 중앙 컨테이너 */}
      <div className="mx-auto grid h-full max-w-[860px] grid-rows-[1fr_auto] px-3">
        {/* 대화 영역 */}
        <div
          ref={scrollRef}
          className="no-scrollbar relative z-10 flex flex-col gap-3 overflow-y-auto py-6">
          {assistantMsgs.map((m) => (
            <motion.div key={m.id} {...fadeUp} className="flex w-full justify-start">
              <ToriBubble>{m.content}</ToriBubble>
            </motion.div>
          ))}

          {typing && (
            <div className="mt-1 flex items-center gap-2 text-[13px] text-black/60">
              <Loader2 className="size-3.5 animate-spin" />
              토리 입력중…
            </div>
          )}

          {/* 곰 캐릭터 */}
          <div className="pointer-events-none relative z-0 mt-6 flex w-full items-end justify-center pb-[18vh]">
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

        {/* 입력창 */}
        <div className="relative z-10 mb-4 grid grid-cols-[1fr_auto] items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 shadow-sm">
          <input
            type="text"
            placeholder="질문을 입력하세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="h-10 w-full bg-transparent text-[14px] text-black outline-none placeholder:text-black/40"
          />
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={pending || !input.trim()}
            className={[
              "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition",
              pending || !input.trim()
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700",
            ].join(" ")}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            <span className="hidden sm:inline">{pending ? "전송중…" : "전송"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
