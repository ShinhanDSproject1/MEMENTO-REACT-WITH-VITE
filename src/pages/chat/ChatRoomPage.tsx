import { markAsRead } from "@/pages/chat/services/chat";
import { ensureConnected, sendRoomMessage, subscribeRoom } from "@/pages/chat/services/chatSocket";
import { http } from "@/shared/api/https";
import defaultimage from "@assets/images/character/character-gom.svg";
import { Send } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

/* ---------------- types ---------------- */
export interface RoomInfo {
  id: string; // chattingRoomSeq
  name: string; // mentosTitle
  group: string; // 상대방 이름
}

export type MessageRole = "bot" | "me";
export interface ChatMessage {
  id: string;
  roomId: string;
  role: MessageRole;
  text: string;
  ts: number;
  profileImageUrl?: string;
}
type LocationState = { room?: RoomInfo } | null;

/* --------------- page --------------- */
export default function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { state } = useLocation() as { state: LocationState };

  const [room, setRoom] = useState<RoomInfo | null>(state?.room ?? null);
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [mySeq, setMySeq] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  /* 초기 로드: 과거 내역 → 소켓 연결 → 방 구독 → 읽음 처리 */
  useEffect(() => {
    if (!roomId) return;

    let alive = true;
    let sub: { unsubscribe: () => void } | null = null;

    const mapMsg = (m: any, mine: number): ChatMessage => ({
      id: `${m.chattingRoomSeq}-${m.sentAt}-${m.senderSeq}`,
      roomId,
      role: m.senderSeq === mine ? "me" : "bot",
      text: m.message,
      ts: new Date(String(m.sentAt).replace(" ", "T")).getTime(),
      profileImageUrl: m.senderSeq !== mine ? m.senderProfileImage : undefined,
    });

    (async () => {
      try {
        // 1) 과거 대화 + 내 seq
        const res = await http.get(`/chat/rooms/${roomId}/messages`);
        const details = res?.data?.result;
        if (!details) return;

        const mine: number = details.mySeq;
        setMySeq(mine);

        const other = details.participants?.find((p: any) => p.memberSeq !== mine);
        if (!alive) return;

        setRoom({
          id: String(details.chattingRoomSeq),
          name: details.mentosTitle,
          group: other?.memberName || "상대방",
        });

        const initial: ChatMessage[] = (details.messages ?? []).map((m: any) => mapMsg(m, mine));
        if (!alive) return;
        setMsgs(initial);

        // 2) 소켓 연결 → 구독 (상대 메시지 실시간 반영)
        await ensureConnected();
        if (!alive) return;

        sub = subscribeRoom(roomId, (body: any) => {
          if (!alive) return;

          const incoming: ChatMessage = {
            id: `${body.chattingRoomSeq}-${body.sentAt}-${body.senderSeq}`,
            roomId,
            role: body.senderSeq === mine ? "me" : "bot",
            text: body.message,
            ts: new Date(String(body.sentAt).replace(" ", "T")).getTime(),
            profileImageUrl: body.senderProfileImage,
          };

          // ⚠️ 내 메시지는 여기서 추가하지 않음 (재조회로만 반영)
          if (incoming.role === "bot") {
            setMsgs((prev) => [...prev, incoming]);
          }
        });

        // 3) 읽음 처리
        await markAsRead(roomId);
      } catch (e) {
        console.error("[CHAT] init error:", e);
      }
    })();

    return () => {
      alive = false;
      sub?.unsubscribe?.();
    };
  }, [roomId]);

  /* 메시지 추가시 자동 스크롤 */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs.length]);

  /* 서버에서 “내가 방금 보낸 메시지”가 실제로 저장/브로드캐스트 되었는지 확인 (폴링) */
  async function refreshUntilSeen(
    text: string,
    opts: { timeoutMs?: number; intervalMs?: number } = {},
  ) {
    const timeoutMs = opts.timeoutMs ?? 5000;
    const intervalMs = opts.intervalMs ?? 450;

    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const res = await http.get(`/chat/rooms/${roomId}/messages`);
      const details = res?.data?.result;

      if (details?.messages?.length && mySeq != null) {
        const mapped: ChatMessage[] = details.messages.map((m: any) => ({
          id: `${m.chattingRoomSeq}-${m.sentAt}-${m.senderSeq}`,
          roomId: String(details.chattingRoomSeq),
          role: m.senderSeq === mySeq ? "me" : "bot",
          text: m.message,
          ts: new Date(String(m.sentAt).replace(" ", "T")).getTime(),
          profileImageUrl: m.senderSeq !== mySeq ? m.senderProfileImage : undefined,
        }));

        // “내가 보낸 동일 텍스트”가 목록에 보이면 갱신
        const foundMine = mapped.find((m) => m.role === "me" && m.text === text);
        if (foundMine) {
          setMsgs(mapped);
          await markAsRead(roomId!);
          return true;
        }
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    return false;
  }

  /* 전송: STOMP /app/chat/send 로 {chattingRoomSeq, message} */
  const onSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !roomId || sending) return;

    setSending(true);
    setInput("");

    try {
      await ensureConnected();
      sendRoomMessage(roomId, text);

      // 서버 반영될 때까지 재조회로 기다렸다가 갱신
      const ok = await refreshUntilSeen(text, { timeoutMs: 6000, intervalMs: 400 });
      if (!ok) {
        // 못 찾으면 한 번은 전체 새로고침(페일세이프)
        const res = await http.get(`/chat/rooms/${roomId}/messages`);
        const details = res?.data?.result;
        if (details && mySeq != null) {
          const refreshed: ChatMessage[] = (details.messages ?? []).map((m: any) => ({
            id: `${m.chattingRoomSeq}-${m.sentAt}-${m.senderSeq}`,
            roomId,
            role: m.senderSeq === mySeq ? "me" : "bot",
            text: m.message,
            ts: new Date(String(m.sentAt).replace(" ", "T")).getTime(),
            profileImageUrl: m.senderSeq !== mySeq ? m.senderProfileImage : undefined,
          }));
          setMsgs(refreshed);
        }
      }
    } catch (err) {
      console.error("메시지 전송 실패:", err);
      // 실패 안내 버블(선택): 필요 없으면 제거 가능
      setMsgs((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          roomId,
          role: "bot",
          text: `⚠️ 전송 실패: 메시지를 보낼 수 없습니다.\n(내용: "${text}")`,
          ts: Date.now(),
        },
      ]);
      setInput(text); // 재전송 편의
    } finally {
      setSending(false);
    }
  };

  const onChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isComposing = (e.nativeEvent as any).isComposing || (e as any).isComposing;
    if (isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="flex h-dvh w-full flex-col overscroll-none rounded-[18px] bg-white">
      <div className="sticky top-0 z-10 flex h-12 shrink-0 items-center border-b border-[#f1f3f6] bg-white px-4 pt-[env(safe-area-inset-top)]">
        <div className="text-[18px] font-bold text-[#4B4E51]">
          {room ? `${room.name} · ${room.group}` : "채팅"}
        </div>
      </div>

      {/* --- 메시지 리스트 렌더링 --- */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#E6EDFF]/[0.22] px-4 py-5">
        {msgs.map((m) => {
          const isMine = m.role === "me";
          const isGhost = !isMine && !m.profileImageUrl; // 프로필 이미지 없는 상대 메시지
          const alignRight = isMine || isGhost; // 오른쪽 정렬 조건

          // 말풍선 색상: 내 메시지(파랑) / 고스트(초록) / 일반 상대(연파랑)
          const bubbleClass = isMine
            ? "bg-[#2563eb]"
            : isGhost
              ? "bg-[#10B981]" // ← 프로필 없는 상대 메시지 전용 색
              : "bg-[#93B1FF]";

          return (
            <div
              key={m.id}
              className={`flex w-full items-end gap-2 ${alignRight ? "justify-end" : "justify-start"}`}>
              {/* 아바타: 왼쪽 정렬이면서 프로필이미지 있을 때만 표시 */}
              {!alignRight && m.profileImageUrl && (
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#565C63]">
                  <img
                    src={m.profileImageUrl || defaultimage}
                    alt="profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
              )}

              {/* 말풍선 */}
              <div
                className={`max-w-[78%] rounded-[18px] px-4 py-2 break-words whitespace-pre-wrap text-white ${bubbleClass}`}>
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      <form
        ref={formRef}
        onSubmit={onSend}
        className="sticky bottom-0 z-10 flex min-h-[60px] shrink-0 items-center gap-3 border-t border-[#e9eef4] bg-white px-4 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_6px_rgba(0,0,0,0.08)]">
        <div className="flex flex-1 items-center rounded-full border border-[#e6eaf0] bg-[#f9fafb] px-4 py-2">
          <textarea
            value={input}
            onChange={onChangeInput}
            onKeyDown={onKeyDownInput}
            rows={1}
            disabled={sending}
            className="w-full resize-none overflow-hidden bg-transparent text-[14px] outline-none placeholder:text-[#c0c7d2] disabled:opacity-60"
            placeholder={
              sending ? "전송 중..." : "채팅을 입력하세요 (Enter: 전송, Shift+Enter: 줄바꿈)"
            }
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="ml-2 flex items-center justify-center hover:opacity-80 disabled:opacity-40">
            <Send size={20} strokeWidth={2} className="text-[#2563eb]" fill="currentColor" />
          </button>
        </div>
      </form>
    </div>
  );
}
