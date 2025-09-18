import { getMessages, getRooms } from "@/pages/chat/services/chat";
import { ensureConnected, subscribeRoom, sendChatMessage } from "@/pages/chat/services/chatSocket";
import defaultimage from "@assets/images/character/character-gom.svg";
import { Send } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useParams } from "react-router-dom";

import { http } from "@/shared/api/https";

export interface Room {
  id: string;
  name: string;
  group: string;
  preview?: string;
  unread?: boolean;
}

export type MessageRole = "bot" | "me";
export interface ChatMessage {
  id: string;
  roomId: string;
  role: MessageRole;
  text: string;
  ts: number;
}

type LocationState = { room?: Room } | null;

function useMe() {
  const [memberSeq, setMemberSeq] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await http.get(`/chat/rooms/${chattingRoomSeq}/messages`);
        const r = res?.data ?? {};
        const seq =
          r?.result?.memberSeq ??
          r?.data?.memberSeq ??
          r?.memberSeq ??
          r?.result?.member?.memberSeq ??
          null;
        if (alive) setMemberSeq(typeof seq === "number" ? seq : null);
      } catch {
        if (alive) setMemberSeq(null);
      } finally {
        if (alive) setLoaded(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { memberSeq, loaded };
}

export default function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { state } = useLocation() as { state: LocationState };

  const { memberSeq, loaded } = useMe();
  const mySeqRef = useRef<number | null>(null);
  useEffect(() => {
    mySeqRef.current = memberSeq ?? null;
  }, [memberSeq]);

  const [room, setRoom] = useState<Room | null>(state?.room ?? null);
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");

  const formRef = useRef<HTMLFormElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 과거 메시지 로드 + 소켓 연결/구독
  useEffect(() => {
    if (!roomId) return;

    let unsub: { unsubscribe: () => void } | null = null;
    (async () => {
      // 1) 과거 메시지(REST)
      const old = await getMessages(roomId);
      setMsgs(old);

      // 2) STOMP 연결 및 구독
      await ensureConnected();
      unsub = subscribeRoom(roomId, (body: any) => {
        const text = body?.message ?? body?.content ?? "";
        const tsStr = body?.sentAt ?? body?.timestamp ?? new Date().toISOString();
        const sender = body?.senderSeq ?? body?.senderMemberSeq ?? body?.memberSeq;

        setMsgs((prev) => [
          ...prev,
          {
            id: `${body?.chattingRoomSeq ?? roomId}-${tsStr}-${sender ?? ""}`,
            roomId,
            role: sender && mySeqRef.current && sender === mySeqRef.current ? "me" : "bot",
            text,
            ts: new Date(String(tsStr).replace(" ", "T")).getTime(),
          },
        ]);
      });
    })();

    return () => {
      unsub?.unsubscribe?.();
    };
  }, [roomId]);

  useEffect(() => {
    if (room || !roomId) return;
    (async () => {
      const rooms = await getRooms();
      const found = rooms.find((r) => String(r.id) === String(roomId));
      if (found) setRoom(found);
    })();
  }, [room, roomId]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs.length]);

  const onSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !roomId) return;

    if (!loaded) {
      alert("로그인 정보를 불러오는 중입니다. 잠시만요.");
      return;
    }

    const now = Date.now();
    setMsgs((prev) => [...prev, { id: `local-${now}`, roomId, role: "me", text, ts: now }]);
    setInput("");
    await sendChatMessage({ roomId, senderMemberSeq: memberSeq, content: text });
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
          {room ? `${room.group} · ${room.name}` : "채팅"}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-4 overflow-hidden overscroll-none bg-[#E6EDFF]/[0.22] px-4 py-5">
        {msgs.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "me" ? "justify-end" : "items-start gap-2"}`}>
            {m.role !== "me" && (
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#565C63]">
                <img src={defaultimage} alt="gom" />
              </div>
            )}
            <div className="max-w-[78%] rounded-[18px] bg-[#93B1FF] px-4 py-2 text-white">
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form
        ref={formRef}
        onSubmit={onSend}
        className="sticky bottom-0 z-10 flex min-h-[60px] shrink-0 items-center gap-3 border-t border-[#e9eef4] bg-white px-4 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_6px_rgba(0,0,0,0.08)]">
        <div className="flex flex-1 items-center rounded-full border border-[#e6eaf0] bg-[#f9fafb] px-4 py-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={onChangeInput}
            onKeyDown={onKeyDownInput}
            rows={1}
            className="w-full resize-none overflow-hidden bg-transparent text-[14px] outline-none placeholder:text-[#c0c7d2]"
            placeholder="채팅을 입력하세요 (Enter: 전송, Shift+Enter: 줄바꿈)"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="ml-2 flex items-center justify-center hover:opacity-80 disabled:opacity-40">
            <Send size={20} strokeWidth={2} className="text-[#2563eb]" fill="currentColor" />
          </button>
        </div>
      </form>
    </div>
  );
}
