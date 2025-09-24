import { Client } from "@stomp/stompjs";
import { getAccessToken as _getAccessToken } from "@/shared/auth/token";

export function resolveWsUrl() {
  const VITE_WS_URL = import.meta.env.VITE_WS_BASE_URL;

  // VITE_WS_URL이 없는 경우에 대한 방어 코드 추가
  if (!VITE_WS_URL) {
    console.error("❌ VITE_WS_BASE_URL 환경 변수가 정의되지 않았습니다!");
    return ""; // 빈 문자열을 반환하여 에러 방지
  }

  // 1. VITE_WS_URL 자체가 완전한 URL인 경우 (예: wss://...)
  if (VITE_WS_URL.startsWith("ws")) {
    return VITE_WS_URL;
  }

  // 2. 상대 경로인 경우 (개발 환경)
  const isSecure = location.protocol === "https:";
  const protocol = isSecure ? "wss" : "ws";
  const host = location.host; // "localhost:3000"
  return `${protocol}://${host}${VITE_WS_URL}`;
}

export const WS_URL = resolveWsUrl();

/** 브로커 경로들 (백엔드 설정과 반드시 일치) */
export const TOPIC_BASE = import.meta.env.VITE_STOMP_TOPIC_BASE ?? "/topic/chat/room";
export const SEND_DEST = import.meta.env.VITE_STOMP_SEND_DEST ?? "/app/chat/send";

/** 토큰 가져오기 */
function getToken(): string {
  try {
    return (_getAccessToken?.() as string) ?? localStorage.getItem("accessToken") ?? "";
  } catch {
    return "";
  }
}

/** STOMP 클라이언트 */
export const stompClient = new Client({
  brokerURL: WS_URL, // full ws:// or wss://
  reconnectDelay: 3000,
  heartbeatIncoming: 10000,
  heartbeatOutgoing: 10000,
  beforeConnect: () => {
    console.log("STOMP 연결 시도 직전...");
    const token = getToken();
    if (token) {
      // 연결 직전에 최신 토큰을 가져와 헤더에 설정합니다.
      stompClient.connectHeaders = {
        Authorization: `Bearer ${token}`,
      };
      console.log("최신 토큰으로 헤더 설정 완료.");
    } else {
      console.warn("STOMP 연결: 토큰이 없습니다.");
    }
  },
});

stompClient.onConnect = () => console.log("✅ STOMP connected");
stompClient.onStompError = (f) => console.error("❌ STOMP error", f);

/** 연결 보장: 중복 activate 방지 + 에러 핸들링 */
let connecting = false;
export async function ensureConnected(): Promise<void> {
  if (stompClient.connected) return;
  if (connecting) {
    // 이미 연결 시도 중이면 연결 완료/실패까지 대기
    await new Promise<void>((resolve, reject) => {
      const ok = () => {
        cleanup();
        resolve();
      };
      const fail = (f: any) => {
        cleanup();
        reject(new Error(f?.body || "STOMP error"));
      };
      const cleanup = () => {
        stompClient.onConnect = prevOnConnect;
        stompClient.onStompError = prevOnError;
      };
      const prevOnConnect = stompClient.onConnect;
      const prevOnError = stompClient.onStompError;
      stompClient.onConnect = ok;
      stompClient.onStompError = fail;
    });
    return;
  }

  connecting = true;
  await new Promise<void>((resolve, reject) => {
    stompClient.onConnect = () => {
      connecting = false;
      resolve();
    };
    stompClient.onStompError = (frame) => {
      connecting = false;
      reject(new Error(frame?.body || "STOMP error"));
    };
    stompClient.activate();
  });
}

/** 방 구독: 메시지 수신 콜백 */
export function subscribeRoom(roomId: string, onMessage: (msg: any) => void) {
  const dest = `${TOPIC_BASE}/${roomId}`;
  return stompClient.subscribe(dest, (message: IMessage) => {
    try {
      onMessage(JSON.parse(message.body));
    } catch {
      onMessage(message.body);
    }
  });
}

/** 메시지 전송 */
export async function sendChatMessage(params: { roomId: string; message: string }) {
  await ensureConnected();
  const payload = {
    chattingRoomSeq: Number(params.roomId),
    message: params.message,
  };
  stompClient.publish({
    destination: SEND_DEST,
    body: JSON.stringify(payload),
  });
}
