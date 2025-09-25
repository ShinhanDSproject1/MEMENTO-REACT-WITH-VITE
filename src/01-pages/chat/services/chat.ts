import { getAccessToken as _getAccessToken } from "@/05-shared/auth/token";

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
  chattingRoomSeq: number;
  opponentName: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  hasUnreadMessage: boolean;
};

type MentosGroupDTO = {
  mentosSeq: number;
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
    assertNumber(g?.mentosSeq, "mentosSeq");
    const mentosTitle = String(g?.mentosTitle ?? "");
    assertArray(g?.chatRooms, "chatRooms");

    const chatRooms: ChatRoomDTO[] = (g.chatRooms as any[]).map((r, ri) => {
      assertNumber(r?.chattingRoomSeq, "chattingRoomSeq");
      const opponentName = String(r?.opponentName ?? "");
      if (!opponentName) throw new Error(`opponentName 누락 (index: ${gi}/${ri})`);

      const lastMessage = r?.lastMessage ?? null;
      const lastMessageAt = r?.lastMessageAt ?? null;
      const hasUnreadMessage = Boolean(r?.hasUnreadMessage);

      return {
        chattingRoomSeq: r.chattingRoomSeq,
        opponentName,
        lastMessage,
        lastMessageAt,
        hasUnreadMessage,
      };
    });

    return {
      mentosSeq: g.mentosSeq,
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

  // 🔍 백엔드 원본 응답 확인용 콘솔 로그
  console.log("📡 백엔드 API 원본 응답:", json);
  console.log("📋 응답 상세 정보:");
  console.log("  - code:", json.code);
  console.log("  - status:", json.status);
  console.log("  - message:", json.message);
  console.log("  - result 배열 길이:", json.result?.length);
  console.log("  - result 내용:", json.result);

  // 🔍 chatRooms 구조 상세 확인
  if (json.result && json.result.length > 0) {
    console.log("🔍 첫 번째 그룹의 chatRooms 구조 확인:");
    console.log("  - chatRooms 배열:", json.result[0].chatRooms);
    if (json.result[0].chatRooms && json.result[0].chatRooms.length > 0) {
      console.log("  - 첫 번째 chatRoom 객체:", json.result[0].chatRooms[0]);
      console.log("  - 첫 번째 chatRoom의 모든 키:", Object.keys(json.result[0].chatRooms[0]));
    }
  }

  const groups = normalizeToSpec(json);

  // 🔧 정규화된 데이터 확인용 콘솔 로그
  console.log("🔧 정규화된 groups 데이터:", groups);

  const rooms: Room[] = [];
  for (const g of groups) {
    const sorted = [...g.chatRooms].sort(
      (a, b) => toEpoch(b.lastMessageAt) - toEpoch(a.lastMessageAt),
    );

    for (const r of sorted) {
      rooms.push({
        id: String(r.chattingRoomSeq), // chatRoomId -> chattingRoomSeq로 변경
        name: r.opponentName, // mentiName -> opponentName으로 변경
        group: g.mentosTitle,
        preview: (r.lastMessage ?? "").trim() || "메시지가 없습니다.",
        unread: r.hasUnreadMessage,
        lastAt: toEpoch(r.lastMessageAt),
      });
    }
  }

  // 🎯 최종 변환된 rooms 데이터 확인용 콘솔 로그
  console.log("🎯 최종 변환된 rooms 데이터:", rooms);
  console.log("📊 rooms 개수:", rooms.length);

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

  // chattingRoomSeq를 사용하는 엔드포인트로 변경
  const res = await fetch(`${BASE}/chatting-rooms/${roomId}/messages`, {
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

/** --- 읽음 처리 --- */
export async function markRoomRead(roomId: number | string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("로그인이 필요합니다.");

  const res = await fetch(`${BASE}/chat/rooms/${roomId}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`읽음 처리 실패: ${res.status} ${msg}`);
  }
}
