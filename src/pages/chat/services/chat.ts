import { http } from "@/shared/api/https";
import { getAccessToken as _getAccessToken } from "@/shared/auth/token";
import { jwtDecode } from "jwt-decode";

/* ----------------------------- 유틸/타입 정의 ----------------------------- */
export interface Room {
  id: string;
  name: string;
  group: string;
  preview?: string;
  unread?: boolean;
  lastAt?: number;
}

type ApiEnvelope<T> = { code: number; status: number; message: string; result: T };

type MentorChatRoomDTO = {
  chatRoomId: number;
  mentiName: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  hasUnreadMessage: boolean;
};

type MenteeChatRoomDTO = {
  chatRoomId: number;
  mentorName: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  hasUnreadMessage: boolean;
};

type MentosGroupDTO = {
  mentosId: number;
  mentosTitle: string;
  chatRooms: ChatRoomDTO[];
};

/** --- 상세/메시지 DTO --- */
export type MessageDTO = {
  chattingRoomSeq: number;
  senderSeq: number;
  senderName: string;
  senderProfileImage?: string;
  message: string;
  sentAt: string;
  memberSeq: number;
};

export type ChatMessage = {
  id: string;
  roomId: string;
  role: "me" | "bot";
  text: string;
  ts: number;
};

/* ------------------------------ 유틸 함수 ------------------------------ */
function toEpoch(s?: string | null): number {
  if (!s) return 0;
  const v = s.includes(" ") ? s.replace(" ", "T") : s;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

function assertArray(a: unknown, label: string): asserts a is any[] {
  if (!Array.isArray(a)) throw new Error(`${label}가 배열이 아닙니다.`);
}

function assertNumber(v: unknown, label: string): asserts v is number {
  if (typeof v !== "number" || !Number.isFinite(v)) {
    throw new Error(`${label}가 숫자가 아닙니다.`);
  }
}

/** --- 멘토용 응답 보정 --- */
function normalizeToSpec(raw: any): MentosGroupDTO[] {
  const arr = raw?.result ?? raw;
  if (!Array.isArray(arr)) {
    throw new Error("menti-list 응답이 배열이 아닙니다.");
  }

  return arr.map((g, gi) => {
    assertNumber(g?.mentosId, "mentosId");
    const mentosTitle = String(g?.mentosTitle ?? "");
    assertArray(g?.chatRooms, "chatRooms");

    const chatRooms: ChatRoomDTO[] = (g.chatRooms as any[]).map((r, ri) => {
      assertNumber(r?.chatRoomId ?? r?.chattingRoomSeq, "chatRoomId");
      const mentiName = String(r?.mentiName ?? r?.mentoName ?? "");
      if (!mentiName) throw new Error(`mentiName 누락 (index: ${gi}/${ri})`);

      const lastMessage = r?.lastMessage ?? null;
      const lastMessageAt = r?.lastMessageAt ?? null;
      const hasUnreadMessage = Boolean(r?.hasUnreadMessage);

      return {
        chatRoomId: r.chatRoomId ?? r.chattingRoomSeq,
        mentiName,
        lastMessage,
        lastMessageAt,
        hasUnreadMessage,
      };
    });

    return {
      mentosId: g.mentosId,
      mentosTitle,
      chatRooms,
    };
  });
}

/* --------------------------- 로그인 계정 Role --------------------------- */
export function isMentiUser(): boolean {
  try {
    const token = _getAccessToken();
    if (!token) return false;
    const payload: any = jwtDecode(token);

    // 💡 수정된 부분: "type" 키를 가장 먼저 확인하도록 추가
    const userType = payload?.type ?? payload?.userType ?? payload?.role ?? payload?.userRole;

    return typeof userType === "string" && userType.toUpperCase() === "MENTI";
  } catch {
    return false;
  }
}

/* --------------------------- 채팅방 목록 조회 --------------------------- */
export async function getRooms(role: "mento" | "menti" = "mento"): Promise<Room[]> {
  // 계정에 따라 URL을 바꾼다
  const url = role === "mento" ? `/mento/menti-list` : `/chat/rooms/menti`;
  const res = await http.get(url);
  const json = res.data;

  // 멘토용 응답: ApiEnvelope<MentosGroupDTO[]>
  if (role === "mento") {
    const groups = normalizeToSpec(json);
    const rooms: Room[] = [];
    for (const g of groups) {
      const sorted = [...g.chatRooms].sort(
        (a, b) => toEpoch(b.lastMessageAt) - toEpoch(a.lastMessageAt),
      );

      for (const r of sorted) {
        rooms.push({
          id: String(r.chatRoomId),
          name: r.mentiName,
          group: g.mentosTitle,
          preview: (r.lastMessage ?? "").trim() || "메시지가 없습니다.",
          unread: r.hasUnreadMessage,
          lastAt: toEpoch(r.lastMessageAt),
        });
      }
    }
    return rooms;
  }

  // 멘티용 응답: /chat/rooms/menti 구조에 맞춰 변환
  const mentiGroups = (json.result ?? json) as any[];
  const rooms: Room[] = [];

  for (const g of mentiGroups) {
    if (!g.chatRooms) continue;
    for (const r of g.chatRooms) {
      rooms.push({
        id: String(r.chatRoomId),
        // 💡 멘티 입장에서는 멘토 이름을 보여줘야 함
        name: r.mentorName ?? "멘토",
        group: g.mentosTitle,
        preview: (r.lastMessage ?? "").trim() || "메시지가 없습니다.",
        unread: r.hasUnreadMessage,
        lastAt: toEpoch(r.lastMessageAt),
      });
    }
  }
  return rooms;
}

/* --------------------------- 특정 방 메시지 조회 --------------------------- */
export async function getMessages(roomId: string): Promise<ChatMessage[]> {
  const res = await http.get(`/chat/rooms/${roomId}/messages`);
  const json: ApiEnvelope<{ messages: MessageDTO[] }> = res.data;
  const msgs = json.result?.messages ?? json.messages ?? [];

  return msgs.map((m) => ({
    id: `${m.chattingRoomSeq}-${m.sentAt}-${m.senderSeq}`,
    roomId,
    role: "bot",
    text: m.message,
    ts: m.sentAt ? new Date(m.sentAt.replace(" ", "T")).getTime() : 0,
  }));
}

/* --------------------------- 메시지 전송 --------------------------- */
export async function sendMessage(roomId: string, text: string): Promise<ChatMessage> {
  const res = await http.post(`/chat/rooms/${roomId}/messages`, { message: text });
  const json: ApiEnvelope<MessageDTO> = res.data;
  const m = json.result ?? json;

  return {
    id: `${m.chattingRoomSeq}-${m.sentAt}-${m.senderSeq}`,
    roomId,
    role: "me",
    text: m.message,
    ts: m.sentAt ? new Date(m.sentAt.replace(" ", "T")).getTime() : 0,
  };
}

/* --------------------------- 메시지 읽음 처리 --------------------------- */
export async function markAsRead(roomId: string): Promise<void> {
  // 응답을 기다릴 뿐 특별히 데이터를 사용하지는 않음
  await http.patch(`/chat/rooms/${roomId}/read`);
}
