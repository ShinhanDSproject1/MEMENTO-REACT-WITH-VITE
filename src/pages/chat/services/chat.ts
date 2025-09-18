import { getAccessToken as _getAccessToken } from "@/shared/auth/token";

export interface Room {
  id: number;
  name: string;
  group: string;
  preview?: string;
  unread?: boolean;
  lastAt?: number; // epoch(ms)
}

type ApiEnvelope<T> = { code: number; status: number; message: string; result: T };

// --- 명세 DTO (키/구조 고정) ---
type ChatRoomDTO = {
  chatRoomId: number;
  mentiName: string;
  lastMessage: string; // 빈 문자열 허용
  lastMessageAt: string; // "YYYY-MM-DD HH:mm:ss" or ISO
  hasUnreadMessage: boolean;
};

type MentosGroupDTO = {
  mentosId: number;
  mentosTitle: string;
  chatRooms: ChatRoomDTO[];
};

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

// utils
function getToken(): string {
  try {
    return (_getAccessToken?.() as string) ?? localStorage.getItem("accessToken") ?? "";
  } catch {
    return "";
  }
}
function toEpochStrict(s: string): number {
  if (!s) return 0;
  const v = s.includes(" ") ? s.replace(" ", "T") : s;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}
// 숫자 or 숫자문자 허용(빈값/엉뚱한 값은 에러)
function asNum(v: unknown, label: string): number {
  if (label === "" || label === null || label === undefined) {
    throw new Error(`${label}가 숫자가 아닙니다.`);
  }
  const n = typeof label === "number" ? label : Number(label);
  if (!Number.isFinite(n)) throw new Error(`${label}가 숫자ddd가 아닙니다.`);
  return n;
}

// 서버 응답을 명세 형태로 보정(키는 명세만 읽음, 타입만 최소 보정)
function normalizeToSpec(raw: any): ApiEnvelope<MentosGroupDTO[]> {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.result)) {
    throw new Error("menti-list 응답이 명세(result 배열)가 아닙니다.");
  }

  const groups: MentosGroupDTO[] = (raw.result as any[]).map((g, gi) => {
    const mentosId = asNum(g?.mentosId, "mentosId"); // "1" → 1
    const mentosTitle = String(g?.mentosTitle ?? "");
    const roomsRaw: any[] = Array.isArray(g?.chatRooms) ? g.chatRooms : []; // 명세 키만 사용

    const chatRooms: ChatRoomDTO[] = roomsRaw.map((r, ri) => {
      const chatRoomId = asNum(r?.chatRoomId, "chatRoomId"); // "3" → 3
      const mentiName = String(r?.mentiName ?? "");
      const lastMessage = String(r?.lastMessage ?? "");
      const lastMessageAt = String(r?.lastMessageAt ?? "");
      const hasUnreadMessage = Boolean(r?.hasUnreadMessage);

      if (!mentiName) throw new Error(`mentiName 누락 (index: ${gi}/${ri})`);
      if (typeof lastMessageAt !== "string") {
        throw new Error(`lastMessageAt 타입 오류 (index: ${gi}/${ri})`);
      }

      return { chatRoomId, mentiName, lastMessage, lastMessageAt, hasUnreadMessage };
    });

    return { mentosId, mentosTitle, chatRooms };
  });

  return { code: raw.code, status: raw.status, message: raw.message, result: groups };
}

// API
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

  const normalized = normalizeToSpec(await res.json());

  const rooms: Room[] = [];
  for (const g of normalized.result) {
    const sorted = [...g.chatRooms].sort(
      (a, b) => toEpochStrict(b.lastMessageAt) - toEpochStrict(a.lastMessageAt),
    );
    for (const r of sorted) {
      rooms.push({
        id: String(r.chatRoomId),
        name: r.mentiName,
        group: g.mentosTitle,
        preview: r.lastMessage, // 채팅이 없으면 빈 문자열 → UI에서 문구 처리
        unread: r.hasUnreadMessage,
        lastAt: toEpochStrict(r.lastMessageAt),
      });
    }
  }
  return rooms;
}
