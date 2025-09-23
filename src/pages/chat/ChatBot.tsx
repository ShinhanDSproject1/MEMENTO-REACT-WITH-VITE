// src/pages/ChatPage.tsx
import { motion, useReducedMotion } from "framer-motion";
import { Bot, Lightbulb, Loader2, RefreshCw, Send, Sparkles, User } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// ✅ 자산 경로(프로젝트 구조에 맞게 조정)
import characterGom from "@shared/assets/images/character/character-main-sit.png";
import mementoLogo from "@shared/assets/images/logo/memento-logo.svg";

// ------ 타입 ------
type Role = "user" | "assistant" | "system";
type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
};

type QuickChip = { label: string; text: string };

// ------ 유틸 ------
const uid = () => Math.random().toString(36).slice(2);
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const BlinkCaret = () => (
  <motion.span
    aria-hidden
    className="ml-0.5 inline-block h-[1em] w-[2px] bg-[#23272E] align-[-0.2em]"
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
  />
);

// ------ 버블 ------
function Bubble({ role, children }: { role: Role; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[78%] items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div
          className={[
            "flex size-8 shrink-0 items-center justify-center rounded-full ring-1 ring-black/5",
            isUser ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700",
          ].join(" ")}
          aria-hidden>
          {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
        </div>
        <div
          className={[
            "rounded-2xl px-3 py-2 text-[14px] leading-6 whitespace-pre-wrap shadow-sm ring-1",
            isUser
              ? "bg-blue-600 text-white ring-blue-600/10"
              : "bg-white text-slate-800 ring-black/5",
          ].join(" ")}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ------ 메인 페이지 ------
export default function ChatPage() {
  const { sessionId = "1" } = useParams();
  const prefersReducedMotion = useReducedMotion();

  // 대화 상태
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid(),
      role: "assistant",
      content:
        "안녕하세요! 저는 메멘토의 AI 도우미 ‘토리’예요.\n원하는 멘토링을 함께 찾아볼까요?\n아래 추천 질문을 눌러 시작해도 좋아요!",
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 빠른 질문 칩
  const quickChips: QuickChip[] = useMemo(
    () => [
      { label: "소비패턴 진단", text: "제 소비 습관을 진단해 주세요." },
      { label: "가치소비", text: "가치 소비를 잘하는 방법이 있을까요?" },
      { label: "저축 루틴", text: "월급에서 현실적인 저축 비율을 추천해줘." },
      { label: "멘토 추천", text: "저에게 맞는 멘토링 클래스를 추천해 주세요." },
    ],
    [],
  );

  // 자동 스크롤
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  // 초기 포커스
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 전송 핸들러
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || pending) return;
      setPending(true);

      // 1) 사용자 메시지 반영
      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: text.trim(),
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");

      try {
        // 2) (옵션) 잠깐의 타이핑 효과
        setTyping(true);

        // 3) 백엔드 호출 (엔드포인트/스키마는 서비스에 맞게 조정!)
        //    예시: POST /api/ai/chat { sessionId, messages }
        //    CORS/프록시는 nginx에서 /api/ → backend:8080 프록시 중
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            // 간단히 최근 N개만 전송 (토큰 절약)
            messages: [...messages, userMsg]
              .slice(-12)
              .map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        // 4) 실패 시 친절한 에러 메시지
        if (!res.ok) {
          throw new Error(`AI 서버 응답 오류(${res.status})`);
        }

        // 5) 응답 파싱 (예: { reply: "..." })
        const data = (await res.json()) as { reply?: string };
        const reply = data?.reply ?? "지금은 답변이 어려워요. 잠시 후 다시 시도해 주세요.";

        // 6) 어시스턴트 메시지 추가
        await delay(prefersReducedMotion ? 0 : 300);
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "assistant", content: reply, createdAt: Date.now() },
        ]);
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            content:
              "앗, 네트워크 상태가 좋지 않거나 서버가 응답하지 않아요.\n잠시 후 다시 시도해 주세요.",
            createdAt: Date.now(),
          },
        ]);
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setTyping(false);
        setPending(false);
      }
    },
    [messages, pending, prefersReducedMotion, sessionId],
  );

  // 키보드 전송
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.keyCode === 13) && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // 모션 프리셋
  const fadeUp = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <div className="relative flex h-dvh w-dvw flex-col bg-white">
      {/* 상단 바 */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-black/5 bg-white/80 px-4 py-2 backdrop-blur">
        <div className="flex items-center gap-3">
          <img src={mementoLogo} alt="memento" className="h-6 w-auto" />
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Sparkles className="size-4 text-amber-500" />
            토리와 대화하기
          </div>
          <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
            세션 #{sessionId}
          </span>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 active:scale-[0.98]"
          onClick={() =>
            setMessages((prev) => [
              prev[0],
              {
                id: uid(),
                role: "assistant",
                content: "새로운 대화를 시작했어요. 무엇이 궁금하신가요?",
                createdAt: Date.now(),
              },
            ])
          }>
          <RefreshCw className="size-3.5" />새 대화
        </button>
      </header>

      {/* 콘텐츠 */}
      <main className="relative grid h-full grid-rows-[auto,1fr,auto]">
        {/* 빠른 시작 칩 */}
        <motion.div className="border-b border-black/5 px-3 py-2" {...fadeUp}>
          <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-2">
            {quickChips.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => sendMessage(q.text)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200/70 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm transition hover:-translate-y-[1px] hover:bg-blue-100">
                <Lightbulb className="size-3.5 opacity-80" />
                {q.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 메시지 영역 */}
        <div
          ref={scrollRef}
          className="no-scrollbar mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-3 py-3">
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            {/* 캐릭터 영역 (상단 인사/존재감) */}
            <motion.div className="mb-1 flex items-center justify-center" {...fadeUp}>
              <motion.img
                src={characterGom}
                alt="메멘토 캐릭터 토리"
                className="h-auto w-[92px]"
                animate={prefersReducedMotion ? {} : { scale: [1, 1.02, 1] }}
                transition={
                  prefersReducedMotion
                    ? undefined
                    : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                }
              />
            </motion.div>

            {messages.map((m) => (
              <motion.div key={m.id} {...fadeUp}>
                <Bubble role={m.role}>{m.content}</Bubble>
              </motion.div>
            ))}

            {typing && (
              <div className="flex items-center gap-2 text-[13px] text-slate-500">
                <Loader2 className="size-3.5 animate-spin" />
                토리 입력중…
                <BlinkCaret />
              </div>
            )}
          </div>
        </div>

        {/* 입력창 */}
        <div className="sticky bottom-0 border-t border-black/5 bg-white px-3 py-2">
          <div className="mx-auto flex max-w-4xl items-center gap-2 rounded-2xl border border-black/10 bg-white px-2.5 py-2 shadow-sm">
            <input
              ref={inputRef}
              type="text"
              placeholder="메시지를 입력하세요"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="h-9 w-full bg-transparent text-[14px] outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => sendMessage(input)}
              disabled={pending || !input.trim()}
              className={[
                "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition",
                pending || !input.trim()
                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]",
              ].join(" ")}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              <span className="hidden sm:inline">{pending ? "전송중…" : "전송"}</span>
            </button>
          </div>
          <p className="mx-auto mt-1 max-w-4xl px-1 text-[11px] text-slate-400">
            대화 내용은 품질 향상을 위해 익명으로 분석될 수 있어요.
          </p>
        </div>
      </main>
    </div>
  );
}
