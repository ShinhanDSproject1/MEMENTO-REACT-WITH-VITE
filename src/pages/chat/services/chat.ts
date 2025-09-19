import { getAccessToken as _getAccessToken } from "@/shared/auth/token";

export interface Room {
  id: string;
  name: string;
  group: string;
  preview?: string;
  unread?: boolean;
  lastAt?: number;
}
type ApiEnvelope<T> = { code: number; status: number; message: string; result: T };

type ChatRoomDTO = {
  chatRoomId: number;
  mentiName: string;
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

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

function getToken(): string {
  try {
    return (_getAccessToken?.() as string) ?? localStorage.getItem("accessToken") ?? "";
  } catch {
    return "";
  }
}

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
/** --- 목록 응답 보정 --- */
function normalizeToSpec(raw: any): MentosGroupDTO[] {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.result)) {
    throw new Error("menti-list 응답이 명세(result 배열)가 아닙니다.");
  }

  const groups = raw.result as any[];

  return groups.map((g, gi) => {
    assertNumber(g?.mentosId, "mentosId");
    const mentosTitle = String(g?.mentosTitle ?? "");
    assertArray(g?.chatRooms, "chatRooms");

    const chatRooms: ChatRoomDTO[] = (g.chatRooms as any[]).map((r, ri) => {
      assertNumber(r?.chatRoomId, "chatRoomId");
      const mentiName = String(r?.mentiName ?? "");
      if (!mentiName) throw new Error(`mentiName 누락 (index: ${gi}/${ri})`);

      const lastMessage = r?.lastMessage ?? null;
      const lastMessageAt = r?.lastMessageAt ?? null;
      const hasUnreadMessage = Boolean(r?.hasUnreadMessage);

      return {
        chatRoomId: r.chatRoomId,
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

export async function getRooms(): Promise<Room[]> {
  const token = getToken();
  if (!token) throw new Error("로그인 정보가 없습니다. 먼저 로그인해 주세요.");

  const res = await fetch(`${BASE}/mento/menti-list`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    if (res.status === 401) throw new Error("인증이 만료되었습니다. 다시 로그인해 주세요. (401)");
    throw new Error(`채팅방 목록 조회 실패: ${res.status} ${msg}`);
  }

  const json: ApiEnvelope<MentosGroupDTO[]> = await res.json();
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

/** --- 특정 방 메시지 조회 --- */
export async function getMessages(roomId: string): Promise<ChatMessage[]> {
  const token = getToken();
  if (!token) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${BASE}/chat/rooms/${roomId}/messages`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`메시지 조회 실패: ${res.status} ${msg}`);
  }

  const json: ApiEnvelope<{ messages: MessageDTO[] }> = await res.json();
  const msgs = json.result.messages ?? [];

  return msgs.map((m) => ({
    id: `${m.chattingRoomSeq}-${m.sentAt}-${m.senderSeq}`,
    roomId,
    role: "bot",
    text: m.message,
    ts: new Date(m.sentAt.replace(" ", "T")).getTime(),
  }));
}

/** --- 메시지 전송 --- */
export async function sendMessage(roomId: string, text: string): Promise<ChatMessage> {
  const token = getToken();
  if (!token) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${BASE}/chat/rooms/${roomId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ message: text }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`메시지 전송 실패: ${res.status} ${msg}`);
  }

  const json: ApiEnvelope<MessageDTO> = await res.json();
  const m = json.result;

  return {
    id: `${m.chattingRoomSeq}-${m.sentAt}-${m.senderSeq}`,
    roomId,
    role: "me",
    text: m.message,
    ts: new Date(m.sentAt.replace(" ", "T")).getTime(),
  };
}
