// chatSocket.ts (SockJS + stomp.js v5 호환 방식)
import { getAccessToken as _getAccessToken } from "@/shared/auth/token";
import { Client, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const HTTP_WS_URL = "https://memento.shinhanacademy.co.kr/ws/chat"; // SockJS는 http/https로 시작
export const TOPIC_BASE = "/topic/chat/room";
export const SEND_DEST = "/app/chat/send";

function getToken() {
  try {
    return (_getAccessToken?.() as string) ?? localStorage.getItem("accessToken") ?? "";
  } catch {
    return "";
  }
}

let stompClient: Client | null = null;

export async function ensureConnected(): Promise<void> {
  if (stompClient?.connected) return;

  // 🔁 SockJS 소켓을 직접 만들어 client.webSocketFactory에 주입
  const socketFactory = () => new SockJS(HTTP_WS_URL);
  const token = getToken();

  stompClient = new Client({
    webSocketFactory: socketFactory, // ← brokerURL 대신 이걸 사용
    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    onConnect: (frame) => console.log("✅ STOMP connected (SockJS)", frame),
    onStompError: (frame) => console.error("❌ STOMP error", frame.headers?.message, frame.body),
    onWebSocketError: (ev) => console.error("❌ WebSocket error", ev),
  });

  await new Promise<void>((resolve, reject) => {
    const prevOK = stompClient!.onConnect;
    const prevER = stompClient!.onStompError;
    stompClient!.onConnect = (f) => {
      prevOK?.(f);
      resolve();
    };
    stompClient!.onStompError = (f) => {
      prevER?.(f);
      reject(f);
    };
    console.log("🚀 STOMP activate via SockJS:", HTTP_WS_URL);
    stompClient!.activate();
  });
}

export function subscribeRoom(roomId: string, onMessage: (msg: any) => void): StompSubscription {
  if (!stompClient?.connected) throw new Error("SockJS STOMP not connected");
  const dest = `${TOPIC_BASE}/${roomId}`;
  console.log("[WS:SUBSCRIBE]", dest);
  return stompClient.subscribe(dest, (message) => {
    console.log("[WS:RECV raw]", message.body);
    try {
      onMessage(JSON.parse(message.body));
    } catch {
      onMessage(message.body);
    }
  });
}

export function sendRoomMessage(roomId: string, text: string) {
  if (!stompClient?.connected) throw new Error("SockJS STOMP not connected");
  const payload = { chattingRoomSeq: Number(roomId), message: text };
  console.log("[WS:SEND]", payload);
  stompClient.publish({
    destination: SEND_DEST,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}
