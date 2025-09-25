// src/widgets/booking/TimeGrid.tsx
import { slotToDate } from "@/shared/lib/datetime";
import { useEffect, useMemo } from "react";

const LEAD_MINUTES = 120;

function buildTimes(start = "10:00", end = "21:00", stepMin = 60) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const out: string[] = [];
  for (let m = sh * 60 + (sm || 0); m <= eh * 60 + (em || 0); m += stepMin) {
    const h = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    out.push(`${h}:${mm}`);
  }
  return out;
}

type AnyAvail = string[] | { availableTime?: string[] } | { result?: { availableTime?: string[] } };

interface Props {
  selectedDate: Date | null;
  selectedTime: string;
  onSelectTime: (t: string) => void;
  apiTimes?: AnyAvail; // 명세 응답 그대로/배열 모두 허용
  startTime?: string; // "10:00"
  endTime?: string; // "18:00"
}

export default function TimeGrid({
  selectedDate,
  selectedTime,
  onSelectTime,
  apiTimes,
  startTime = "10:00",
  endTime = "21:00",
}: Props) {
  const now = new Date();

  // 어떤 형태로 와도 availableTime 배열로 정규화
  const available: string[] = useMemo(() => {
    if (Array.isArray(apiTimes)) return apiTimes.map(String);
    if (apiTimes && Array.isArray((apiTimes as any).availableTime))
      return (apiTimes as any).availableTime.map(String);
    if ((apiTimes as any)?.result?.availableTime)
      return (apiTimes as any).result.availableTime.map(String);
    return [];
  }, [apiTimes]);

  const items = useMemo(() => {
    if (!selectedDate) return [];
    const base = buildTimes(startTime, endTime, 60);
    const set = new Set(available);
    const isToday = selectedDate.toDateString() === now.toDateString();
    const minAllowed = new Date();
    minAllowed.setMinutes(minAllowed.getMinutes() + LEAD_MINUTES);

    return base.map((t) => {
      const byList = set.has(t); // 명세: 포함된 시간만 가능
      const passLead = !isToday || slotToDate(selectedDate, t) > minAllowed;
      return { time: t, enabled: byList && passLead };
    });
  }, [selectedDate, available, startTime, endTime]);

  // 비활성으로 바뀌면 선택 해제
  useEffect(() => {
    if (!selectedTime) return;
    const ok = items.some((it) => it.time === selectedTime && it.enabled);
    if (!ok) onSelectTime("");
  }, [items, selectedTime, onSelectTime]);

  if (!selectedDate) return null;

  const noneEnabled = items.every((it) => !it.enabled);

  return (
    <div className="mb-8 grid grid-cols-3 gap-3">
      {items.map(({ time, enabled }) => {
        const chosen = enabled && selectedTime === time;
        return (
          <button
            key={time}
            type="button"
            disabled={!enabled}
            onClick={() => enabled && onSelectTime(time)}
            className={[
              "text-l h-12 rounded-lg border font-medium transition-colors",
              chosen
                ? "border-blue-500 bg-[#005EF9] text-white"
                : enabled
                  ? "border-gray-200 bg-white text-[#4D4B4C] hover:border-gray-300"
                  : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400",
            ].join(" ")}
            title={enabled ? time : "예약 불가"}>
            {time}
          </button>
        );
      })}
      {noneEnabled && (
        <div className="col-span-3 text-center text-sm text-gray-500">
          예약 가능한 시간이 없습니다.
        </div>
      )}
    </div>
  );
}
