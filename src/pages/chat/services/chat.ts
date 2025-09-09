import { ROOMS } from "@/pages/chat/data/rooms";

// ---- 타입 정의 ----
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

export async function getRooms(): Promise<Room[]> {
  await sleep();
  return ROOMS as Room[]; // ROOMS가 맞는 타입임을 단언
}

export async function getMessages(roomId: string): Promise<Message[]> {
  await sleep();
  return [
    {
      id: "m1",
      roomId,
      role: "bot",
      text: "안녕하세요 질문할게요",
      ts: Date.now() - 60000,
    },
    {
      id: "m2",
      roomId,
      role: "me",
      text: "넵넵 질문하시던가요!",
      ts: Date.now() - 30000,
    },
  ];
}

export async function sendMessage(
  roomId: string,
  text: string
): Promise<Message> {
  await sleep(120);
  return {
    id: String(Math.random()),
    roomId,
    role: "me",
    text,
    ts: Date.now(),
  };
}
