// src/pages/chat/ChatRoomPage.tsx
import { getMessages, getRooms, sendMessage } from "@/pages/chat/services/chat";
import defaultimage from "@assets/images/character/character-gom.svg";
import { Send } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useParams } from "react-router-dom";

// 공용 타입 (프로젝트에선 src/types/chat.ts 등으로 분리 권장)
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

export default function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { state } = useLocation() as { state: LocationState };

  const [room, setRoom] = useState<Room | null>(state?.room ?? null);
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 메시지 로드
  useEffect(() => {
    if (!roomId) return;
    (async () => {
      const data = await getMessages(roomId);
      setMsgs(data);
    })();
  }, [roomId]);

  // 방 정보가 없으면 rooms에서 찾아서 채워주기
  useEffect(() => {
    if (room || !roomId) return;
    (async () => {
      const rooms = await getRooms();
      const found = rooms.find((r) => String(r.id) === String(roomId));
      if (found) setRoom(found);
    })();
  }, [room, roomId]);

  // 새 메시지 추가될 때 스크롤 맨 아래로
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs.length]);

  const onSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !roomId) return;

    const newMsg = await sendMessage(roomId, text);
    setMsgs((prev) => [...prev, newMsg]);
    setInput("");
  };

  const onChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
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
        onSubmit={onSend}
        className="sticky bottom-0 z-10 flex min-h-[60px] shrink-0 items-center gap-3 border-t border-[#e9eef4] bg-white px-4 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_6px_rgba(0,0,0,0.08)]">
        <div className="flex flex-1 items-center rounded-full border border-[#e6eaf0] bg-[#f9fafb] px-4 py-2">
          <textarea
            value={input}
            onChange={onChangeInput}
            rows={1}
            className="w-full resize-none bg-transparent text-[14px] outline-none placeholder:text-[#c0c7d2]"
            placeholder="채팅을 입력하세요"
          />
          <button type="submit" className="ml-2 flex items-center justify-center hover:opacity-80">
            <Send size={20} strokeWidth={2} className="text-[#2563eb]" fill="currentColor" />
          </button>
        </div>
      </form>
    </div>
  );
}
