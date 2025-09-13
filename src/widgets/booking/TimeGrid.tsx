import { slotToDate } from "@/shared/lib/datetime";
import { useEffect, useMemo } from "react";

const COMMON_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];
const LEAD_MINUTES = 120;

interface Props {
  selectedDate: Date | null;
  selectedTime: string;
  onSelectTime: (t: string) => void;
  availableTimes?: string[];
}

export default function TimeGrid({
  selectedDate,
  selectedTime,
  onSelectTime,
  availableTimes,
}: Props) {
  const now = new Date();

  const slots = useMemo(() => {
    if (!selectedDate) return [];

    const base = availableTimes && availableTimes.length > 0 ? availableTimes : COMMON_SLOTS;

    const isToday = selectedDate.toDateString() === now.toDateString();
    if (!isToday) return base;

    const minAllowed = new Date();
    minAllowed.setMinutes(minAllowed.getMinutes() + LEAD_MINUTES);
    return base.filter((t) => slotToDate(selectedDate, t) > minAllowed);
  }, [selectedDate, availableTimes]);

  useEffect(() => {
    if (selectedTime && !slots.includes(selectedTime)) {
      onSelectTime("");
    }
  }, [slots, selectedTime, onSelectTime]);

  if (!selectedDate) return null;

  return (
    <div className="mb-8 grid grid-cols-3 gap-3">
      {slots.map((timeStr) => {
        const chosen = selectedTime === timeStr;
        return (
          <button
            key={timeStr}
            onClick={() => onSelectTime(timeStr)}
            className={`h-12 rounded-lg border text-sm font-medium transition-colors ${
              chosen
                ? "border-blue-500 bg-[#005EF9] text-white"
                : "border-gray-200 bg-white text-[#4D4B4C] hover:border-gray-300"
            }`}>
            {timeStr}
          </button>
        );
      })}
      {slots.length === 0 && (
        <div className="col-span-3 text-center text-sm text-gray-500">
          예약 가능한 시간이 없습니다.
        </div>
      )}
    </div>
  );
}
