import { ROOMS } from "@/pages/chat/data/rooms"; // 모킹 데이터 (개발용)

export interface Room {
  id: string;
  name: string;
  group: string;
  preview?: string;
  unread?: boolean;
}

export interface Message {
  id: string;
  roomId: string;
  role: "bot" | "me";
  text: string;
  ts: number;
}

const sleep = (ms = 200) => new Promise((r) => setTimeout(r, ms));

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";
const USE_MOCK = (() => {
  const v = String(import.meta.env.VITE_USE_MOCK ?? "0").toLowerCase();
  return v === "1" || v === "true";
})();

// 명세서 기준
type ApiResp<T> = { code: number; status: number; message: string; result: T };

type ChatRoomDTO = {
  chatRoomId: number;
  mentiName: string;
  lastMessage: string;
  lastMessageAt: string;
  hasUnreadMessage: boolean;
};

type MentosGroupDTO = {
  mentosId: number;
  mentosTitle: string;
  chatRooms: ChatRoomDTO[];
};

function toEpoch(s: string) {
  if (!s) return 0;
  const normalized = s.includes(" ") ? s.replace(" ", "T") : s;
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

function mapToRooms(groups: MentosGroupDTO[]): Room[] {
  const out: Room[] = [];
  for (const g of groups ?? []) {
    const sorted = [...(g.chatRooms ?? [])].sort(
      (a, b) => toEpoch(b.lastMessageAt) - toEpoch(a.lastMessageAt),
    );
    for (const r of sorted) {
      out.push({
        id: String(r.chatRoomId),
        name: r.mentiName,
        group: g.mentosTitle,
        preview: r.lastMessage,
        unread: r.hasUnreadMessage,
      });
    }
  }
  return out;
}

// ---- 실제 호출: 채팅방 목록 ----
export async function getRooms(): Promise<Room[]> {
  if (USE_MOCK) {
    await sleep(120);
    return ROOMS as Room[];
  }

  const token = localStorage.getItem("accessToken") ?? "";
  const res = await fetch(`${BASE}/mento/menti-list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    console.warn(`[getRooms] HTTP ${res.status} → ROOMS mock으로 폴백합니다.`);
    await sleep(120);
    return ROOMS as Room[];
  }

  const data: ApiResp<MentosGroupDTO[]> = await res.json();
  return mapToRooms(data.result ?? []);
}

// ---- 메시지/전송 (지금은 Mock 유지) ----
export async function getMessages(roomId: string): Promise<Message[]> {
  await sleep();
  return [
    { id: "m1", roomId, role: "bot", text: "안녕하세요 질문할게요", ts: Date.now() - 60000 },
    { id: "m2", roomId, role: "me", text: "넵넵 질문하시던가요!", ts: Date.now() - 30000 },
  ];
}

export async function sendMessage(roomId: string, text: string): Promise<Message> {
  await sleep(120);
  return { id: String(Math.random()), roomId, role: "me", text, ts: Date.now() };
}
