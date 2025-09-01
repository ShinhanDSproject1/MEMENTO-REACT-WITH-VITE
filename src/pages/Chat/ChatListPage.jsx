import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRooms } from "./services/chat";
import defaultimage from "@/assets/images/gom.png";

const groupBy = (arr, key) => arr.reduce((acc, x) => ((acc[x[key]] ??= []).push(x), acc), {});

export default function ChatListPage() {
  const nav = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setRooms(await getRooms());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = useMemo(() => groupBy(rooms, "group"), [rooms]);

  return (
    <div className="flex h-screen flex-col overflow-hidden rounded-[18px] bg-white">
      <div className="flex items-center justify-between px-2 pt-2 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="mb-3 pl-9 text-left text-[20px] font-bold">멘티 관리하기</h2>
        </div>
      </div>

      <div className="space-y-5 px-3">
        {Object.entries(grouped).map(([title, items], i) => (
          <section key={title} className={i > 0 ? "border-t border-[#eef0f4] pt-3" : ""}>
            <h3 className="mb-3 px-1 text-[20px] font-medium text-[#d1d5db]">{title}</h3>
            <ul className="space-y-3">
              {items.map((r) => (
                <li key={r.id}>
                  <Link
                    to={`/chat/${r.id}`}
                    className="flex items-center gap-3 rounded-[14px] border border-[#eef0f4] bg-white px-4 py-3 shadow-[0_1px_0_rgba(17,17,17,0.02)] hover:bg-[#fafafa]">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f1f3f6] text-xl">
                      <img src={defaultimage} alt="gom" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-semibold">{r.name}</div>
                      <div className="truncate text-[12px] text-[#9aa2ae]">{r.preview}</div>
                    </div>
                    {r.unread && <span className="h-2.5 w-2.5 rounded-full bg-[#ef233c]" />}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
