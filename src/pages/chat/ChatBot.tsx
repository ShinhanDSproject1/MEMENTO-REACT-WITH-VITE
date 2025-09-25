// src/pages/ChatPage.tsx
import characterGom from "@shared/assets/images/character/character-main-sit.png";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ===== API 베이스 & 추천 라우트 =====
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ""; // 예: http://localhost:8001
const apiUrl = (path: string) => `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
const RECOMMEND_ROUTE = import.meta.env.VITE_RECOMMEND_ROUTE ?? "/ai/recommend";

// ===== 타입 =====
type AssistantMessage = { id: string; content: string; createdAt: number };

const uid = () => Math.random().toString(36).slice(2);
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// (실 서비스에서는 로그인 사용자에서 읽어오세요)
const getMemberSeq = () => {
  const v = localStorage.getItem("member_seq");
  return v ? Number(v) : 1; // 없으면 임시 1
};

export default function ChatPage() {
  const { sessionId = "1" } = useParams();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  // 서버에서 받은 전체 메시지(최신)
  const [bubble, setBubble] = useState<AssistantMessage>({
    id: uid(),
    content: "",
    createdAt: Date.now(),
  });

  // 텍스트 타이핑용 상태
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(false);

  // 입력창/요청 상태
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  // 질의 누적(추천 용)
  const [queries, setQueries] = useState<string[]>([]);

  // 추천 버튼 노출 여부
  const [recReady, setRecReady] = useState(false);

  // ===== 인트로 메시지 =====
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(apiUrl(`/ai/chatbot/1`), {
          headers: { Accept: "application/json" },
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`intro fetch ${res.status}`);
        const data = (await res.json()) as { message?: string };
        const msg =
          data?.message?.trim() ||
          "안녕하세요! 저는 메멘토의 AI 도우미 ‘토리’예요.\n궁금한 걸 편하게 입력해 주세요.";
        setBubble({ id: uid(), content: msg, createdAt: Date.now() });
      } catch (e: any) {
        if (e?.name === "AbortError") return; // 정상 abort는 무시
        setBubble({
          id: uid(),
          content:
            "안녕하세요! 저는 메멘토의 AI 도우미 ‘토리’예요.\n궁금한 걸 편하게 입력해 주세요.",
          createdAt: Date.now(),
        });
        console.error(e);
      }
    })();
    return () => ac.abort();
  }, []);

  // ===== 타자 효과 =====
  useEffect(() => {
    const full = bubble.content ?? "";
    setDisplayed("");
    if (!full) {
      setTyping(false);
      return;
    }
    setTyping(true);

    const STEP_MS = prefersReducedMotion ? 0 : 16;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(timer);
        setTyping(false);
      }
    }, STEP_MS);

    return () => clearInterval(timer);
  }, [bubble.content, prefersReducedMotion]);

  // ===== 메시지 전송 =====
  const sendMessage = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || pending) return;

      // 질의 누적
      setQueries((prev) => [...prev, question]);

      setPending(true);
      try {
        setTyping(true);

        const res = await fetch(apiUrl("/ai/chatbot"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            member_seq: getMemberSeq(),
            content: question,
          }),
        });

        if (!res.ok) throw new Error(`chatbot POST ${res.status}`);
        const data = (await res.json()) as {
          response?: string;
          recommendation_ready?: boolean;
          conversation_history?: string[];
        };

        const reply = data?.response ?? "지금은 답변이 어려워요. 잠시 후 다시 시도해주세요.";

        await delay(prefersReducedMotion ? 0 : 120);
        setBubble({ id: uid(), content: reply, createdAt: Date.now() });

        // ✅ 서버가 추천 준비됐다고 알려주면 버튼만 노출
        setRecReady(!!data?.recommendation_ready);

        // ✅ 서버가 대화 히스토리를 내려주면 로컬 queries 업데이트
        if (Array.isArray(data?.conversation_history) && data!.conversation_history!.length) {
          setQueries(data!.conversation_history!);
        }
      } catch (e) {
        setBubble({
          id: uid(),
          content: "앗, 서버와 연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요.",
          createdAt: Date.now(),
        });
        console.error(e);
      } finally {
        setTyping(false);
        setPending(false);
        setInput("");
      }
    },
    [pending, prefersReducedMotion],
  );

  const fadeIn = useMemo(
    () =>
      prefersReducedMotion
        ? {}
        : {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
          },
    [prefersReducedMotion],
  );

  return (
    <div className="relative w-full overflow-hidden">
      {/* 배경 */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#E8F1FF] to-[#C9E0FF]"
      />

      {/* 헤더 아래부터 화면 채우는 3행 그리드 (상: 텍스트/버튼, 중: 토리, 하: 입력) */}
      <div
        className="mx-auto grid max-w-[980px] grid-rows-[minmax(0,auto)_minmax(0,1fr)_auto] px-4"
        style={{ height: "calc(100dvh - var(--app-header-h, 56px))" } as React.CSSProperties}>
        {/* (1) 상단: 텍스트 + (조건부) 버튼 */}
        <div className="flex min-h-0 items-start justify-center py-3">
          <motion.div {...fadeIn} className="w-full">
            <div className="max-h-full overflow-y-auto overscroll-contain">
              <div className="mx-auto w-full px-1 py-0">
                {/* 타자 효과 텍스트 */}
                <p className="text-[14px] leading-7 whitespace-pre-wrap text-black sm:text-[16px]">
                  {displayed}
                  {!typing && (
                    <span className="ml-0.5 inline-block h-[1em] w-[1px] animate-pulse bg-black/80 align-baseline" />
                  )}
                </p>

                {/* ✅ 추천 버튼: 준비 완료일 때만, 중앙에만 표시 */}
                {recReady && (
                  <div className="mt-4 flex w-full items-center justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(RECOMMEND_ROUTE, {
                          state: {
                            member_seq: getMemberSeq(),
                            queries,
                            from: "chatbot",
                            sessionId,
                          },
                        })
                      }
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                      추천 받아보기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* (2) 가운데: 토리 */}
        <div className="relative flex items-center justify-center">
          <motion.img
            src={characterGom}
            alt="토리"
            className="h-auto w-[min(200px,28dvh)]"
            animate={prefersReducedMotion ? {} : { scale: [1, 1.02, 1] }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 2.0, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </div>

        {/* (3) 하단: 입력창 */}
        <div className="pb-[max(env(safe-area-inset-bottom),0px)]">
          <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 shadow-sm">
            <input
              type="text"
              placeholder="질문을 입력하세요"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || (e as any).keyCode === 13) && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              className="h-11 w-full bg-transparent text-[15px] text-black outline-none placeholder:text-black/40"
            />
            <button
              type="button"
              onClick={() => sendMessage(input)}
              disabled={pending || !input.trim()}
              className={[
                "inline-flex h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition",
                pending || !input.trim()
                  ? "cursor-not-allowed bg-gray-200 text-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700",
              ].join(" ")}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              <span className="hidden sm:inline">{pending ? "전송중…" : "전송"}</span>
            </button>
          </div>
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}
