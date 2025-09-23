import { getAccessToken as _getAccessToken } from "@/shared/auth/token";
import { Client, type IMessage } from "@stomp/stompjs";

function resolveWsUrl() {
  const abs = import.meta.env.VITE_WS_ABSOLUTE as string | undefined;
  if (import.meta.env.PROD && abs) return abs;
  const scheme = location.protocol === "https:" ? "wss" : "ws";
  return `${scheme}://${location.host}/ws-stomp/websocket`;
}
export const WS_URL = resolveWsUrl();

export const TOPIC_BASE = import.meta.env.VITE_STOMP_TOPIC_BASE ?? "/topic/chat/rooms";
export const SEND_DEST = import.meta.env.VITE_STOMP_SEND_DEST ?? "/app/chat/send";

function getToken(): string {
  try {
    return (_getAccessToken?.() as string) ?? localStorage.getItem("accessToken") ?? "";
  } catch {
    return "";
  }
}

export const stompClient = new Client({
  brokerURL: WS_URL,
  reconnectDelay: 3000,
  heartbeatIncoming: 10000,
  heartbeatOutgoing: 10000,
  debug: () => {},
  connectHeaders: {
    Authorization: `Bearer ${getToken()}`,
  },
});

let connecting = false;
export async function ensureConnected(): Promise<void> {
  if (stompClient.connected) return;
  if (connecting) {
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
export async function sendChatMessage(params: {
  roomId: string;
  senderMemberSeq: number;
  content: string;
}) {
  await ensureConnected();
  const payload = {
    chattingRoomSeq: Number(params.roomId),
    senderMemberSeq: params.senderMemberSeq,
    content: params.content,
  };
  stompClient.publish({
    destination: SEND_DEST,
    body: JSON.stringify(payload),
  });
}
