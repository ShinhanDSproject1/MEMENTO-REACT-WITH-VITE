import { ROOMS } from "../data/rooms";

const sleep = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export async function getRooms() {
  await sleep();
  return ROOMS;
}

export async function getMessages(roomId) {
  await sleep();
  return [
    { id: "m1", roomId, role: "bot", text: "안녕하세요 질문할게요", ts: Date.now() - 60000 },
    { id: "m2", roomId, role: "me", text: "넵넵 질문하시던가요!", ts: Date.now() - 30000 },
  ];
}

export async function sendMessage(roomId, text) {
  await sleep(120);
  return { id: String(Math.random()), roomId, role: "me", text, ts: Date.now() };
}
