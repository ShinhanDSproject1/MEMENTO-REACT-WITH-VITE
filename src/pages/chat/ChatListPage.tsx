import { getRooms } from "@/pages/chat/services/chat";
import defaultimage from "@assets/images/character/character-gom.svg";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// ---- 타입 정의 ----
export interface Room {
  id: string;
  name: string;
  group: string;
  preview?: string;
  unread?: boolean;
}

// groupBy 유틸
function groupBy<T extends Record<string, any>, K extends keyof T>(
  arr: T[],
  key: K
): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});
}

export default function ChatListPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRooms();
        setRooms(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = useMemo(() => groupBy(rooms, "group"), [rooms]);

  return (
    <div className="l flex min-h-screen w-full justify-center overflow-x-hidden bg-[#f5f6f8] antialiased">
      <section className="w-full overflow-x-hidden bg-white px-4 py-5">
        <h1 className="font-WooridaumB mt-6 mb-15 pl-2 text-[20px] font-bold">
          멘티 채팅
        </h1>
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3">
          {Object.entries(grouped).map(([title, items], i) => (
            <section
              key={title}
              className={i > 0 ? "border-t border-[#eef0f4] pt-3" : ""}
            >
              <h3 className="mb-3 px-1 text-[20px] font-medium text-[#333]">
                {title}
              </h3>
              <ul className="space-y-3">
                {items.map((r) => (
                  <li key={r.id}>
                    <Link
                      to={`/chat/${r.id}`}
                      state={{
                        room: { id: r.id, name: r.name, group: r.group },
                      }}
                      className="flex items-center gap-3 rounded-[14px] border border-[#eef0f4] bg-white px-4 py-3 shadow-[0_1px_0_rgba(17,17,17,0.02)] hover:bg-[#fafafa]"
                    >
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f1f3f6] text-xl">
                        <img src={defaultimage} alt="gom" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14px] font-semibold">
                          {r.name}
                        </div>
                        <div className="truncate text-[12px] text-[#9aa2ae]">
                          {r.preview}
                        </div>
                      </div>
                      {r.unread && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ef233c]" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
