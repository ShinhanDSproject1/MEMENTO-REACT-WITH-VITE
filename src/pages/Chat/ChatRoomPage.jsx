import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Send } from "lucide-react";
import { getMessages, sendMessage, getRooms } from "./services/chat";
import defaultimage from "@/assets/images/gom.png";

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const [room, setRoom] = useState(state?.room || null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    (async () => setMsgs(await getMessages(roomId)))();
  }, [roomId]);

  useEffect(() => {
    if (room) return;
    (async () => {
      const rooms = await getRooms();
      const found = rooms.find((r) => String(r.id) === String(roomId));
      if (found) setRoom(found);
    })();
  }, [room, roomId]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs.length]);

  const onSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = await sendMessage(roomId, input.trim());
    setMsgs((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="flex h-dvh w-full flex-col overscroll-none rounded-[18px] bg-white">
      <div className="sticky top-0 z-10 flex h-12 shrink-0 items-center border-b border-[#f1f3f6] bg-white px-4 pt-[env(safe-area-inset-top)]">
        <div className="text-[18px] font-bold text-[#4B4E51]">
          {room ? `${room.group} · ${room.name}` : "채팅"}
        </div>
      </div>
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-4 overflow-hidden overscroll-none bg-[#E6EDFF]/[0.22] px-4 py-5">
        {msgs.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "me" ? "justify-end" : "items-start gap-2"}`}>
            {m.role !== "me" && (
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#565C63]">
                {" "}
                <img src={defaultimage} alt="gom" />
              </div>
            )}
            <div className="max-w-[78%] rounded-[18px] bg-[#93B1FF] px-4 py-2 text-white">
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={onSend}
        className="sticky bottom-0 z-10 flex min-h-[60px] shrink-0 items-center gap-3 border-t border-[#e9eef4] bg-white px-4 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_6px_rgba(0,0,0,0.08)]">
        <div className="flex flex-1 items-center rounded-full border border-[#e6eaf0] bg-[#f9fafb] px-4 py-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            className="w-full resize-none bg-transparent text-[14px] outline-none placeholder:text-[#c0c7d2]"
            placeholder="채팅을 입력하세요"
          />
          <button type="submit" className="ml-2 flex items-center justify-center hover:opacity-80">
            <Send size={20} strokeWidth={2} className="text-[#2563eb]" fill="currentColor" />
          </button>
        </div>
      </form>
    </div>
  );
}
