import { ensureConnected, subscribeRoom, sendChatMessage } from "@/pages/chat/services/chatSocket";
import defaultimage from "@assets/images/character/character-gom.svg";
import { Send } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useParams } from "react-router-dom";

import { http } from "@/shared/api/https";

// --- 인터페이스 정의 ---
export interface RoomInfo {
  id: string;
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
  profileImageUrl?: string; // 상대방 프로필 이미지
}

type LocationState = { room?: RoomInfo } | null;

// --- useMe 커스텀 훅 ---
function useMe() {
  const [memberSeq, setMemberSeq] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await http.get(`/mypage/profile`);
        const userSeqFromResult = res?.data?.result?.memberSeq;
        if (alive) {
          setMemberSeq(typeof userSeqFromResult === "number" ? userSeqFromResult : null);
        }
      } catch (error) {
        console.error("내 정보를 가져오는데 실패했습니다:", error);
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

// --- ChatRoomPage 컴포넌트 ---
export default function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { state } = useLocation() as { state: LocationState };

  const { memberSeq, loaded } = useMe();
  const mySeqRef = useRef<number | null>(null);
  useEffect(() => {
    mySeqRef.current = memberSeq ?? null;
  }, [memberSeq]);

  const [room, setRoom] = useState<RoomInfo | null>(state?.room ?? null);
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");

  const formRef = useRef<HTMLFormElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 과거 메시지 로드, 채팅방 정보 설정, 소켓 구독을 하나의 useEffect에서 처리
  useEffect(() => {
    // roomId가 없거나, 아직 내 정보(mySeqRef)를 불러오지 못했다면 아무것도 하지 않음
    if (!roomId || !mySeqRef.current) return;

    let subscription: { unsubscribe: () => void } | null = null;

    const setupChatRoom = async () => {
      try {
        // 1. 채팅방 상세 정보(제목, 참여자, 과거 메시지)를 한 번에 가져옴
        const res = await http.get(`/chat/rooms/${roomId}/messages`);
        const details = res?.data?.result;

        if (!details) {
          console.error("채팅방 정보를 불러오지 못했습니다.");
          return;
        }

        // 2. 채팅방 정보 설정 (멘토스 제목, 상대방 이름)
        const other = details.participants.find((p: any) => p.memberSeq !== mySeqRef.current);
        setRoom({
          id: String(details.chattingRoomSeq),
          name: details.mentosTitle,
          group: other?.memberName || "상대방",
        });

        // 3. 과거 메시지 상태 설정
        const oldMessages = details.messages.map(
          (msg: any): ChatMessage => ({
            id: `${msg.chattingRoomSeq}-${msg.sentAt}-${msg.senderSeq}`,
            roomId,
            role: msg.senderSeq === mySeqRef.current ? "me" : "bot",
            text: msg.message,
            ts: new Date(msg.sentAt).getTime(),
            profileImageUrl:
              msg.senderSeq !== mySeqRef.current ? msg.senderProfileImage : undefined,
          }),
        );
        setMsgs(oldMessages);

        // 4. STOMP 연결 및 구독
        await ensureConnected();
        subscription = subscribeRoom(roomId, (body: any) => {
          setMsgs((prev) => [
            ...prev,
            {
              id: `${body.chattingRoomSeq}-${body.sentAt}-${body.senderSeq}-${Math.random()}`,
              roomId,
              role: body.senderSeq === mySeqRef.current ? "me" : "bot",
              text: body.message,
              ts: new Date(body.sentAt).getTime(),
              profileImageUrl:
                body.senderSeq !== mySeqRef.current ? body.senderProfileImage : undefined,
            },
          ]);
        });
      } catch (error) {
        console.error("채팅방 설정 중 에러:", error);
      }
    };

    setupChatRoom();

    // 5. Cleanup 함수: 컴포넌트가 사라질 때 이전 구독을 확실하게 해제
    return () => {
      if (subscription) {
        subscription.unsubscribe();
        console.log(`Unsubscribed from room ${roomId}`);
      }
    };
  }, [roomId, loaded]); // roomId가 바뀌거나, 내 정보 로딩이 완료될 때 재실행

  // 스크롤 맨 아래로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs.length]);

  // 메시지 전송 함수
  const onSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !roomId) return;

    if (!loaded) {
      alert("로그인 정보를 불러오는 중입니다. 잠시만요.");
      return;
    }

    if (!mySeqRef.current) {
      alert("사용자 정보를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setInput("");

    await sendChatMessage({
      roomId,
      senderMemberSeq: mySeqRef.current,
      content: text,
    });
  };

  // 입력창 핸들러
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

  // JSX 렌더링
  return (
    <div className="flex h-dvh w-full flex-col overscroll-none rounded-[18px] bg-white">
      <div className="sticky top-0 z-10 flex h-12 shrink-0 items-center border-b border-[#f1f3f6] bg-white px-4 pt-[env(safe-area-inset-top)]">
        <div className="text-[18px] font-bold text-[#4B4E51]">
          {room ? `${room.name} · ${room.group}` : "채팅"}
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
                <img
                  src={m.profileImageUrl || defaultimage}
                  alt="profile"
                  className="h-full w-full rounded-full object-cover"
                />
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
