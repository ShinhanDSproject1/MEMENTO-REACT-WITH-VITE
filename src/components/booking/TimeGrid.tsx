import { useMemo } from "react";
import { slotToDate } from "@/utils/datetime";

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
}
export default function TimeGrid({ selectedDate, selectedTime, onSelectTime }: Props) {
  const now = new Date();

  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    const minAllowed = new Date();
    minAllowed.setMinutes(minAllowed.getMinutes() + LEAD_MINUTES);
    const isToday = selectedDate.toDateString() === now.toDateString();
    if (!isToday) return COMMON_SLOTS;
    return COMMON_SLOTS.filter((t) => slotToDate(selectedDate, t) > minAllowed);
  }, [selectedDate]);

  if (!selectedDate) return null;

  return (
    <div className="mb-8 grid grid-cols-3 gap-3">
      {availableTimes.map((timeStr) => {
        const chosen = selectedTime === timeStr;
        const ok = true;

        return (
          <button
            key={timeStr}
            onClick={() => ok && onSelectTime(timeStr)}
            disabled={!ok}
            className={`h-12 rounded-lg border text-sm font-medium transition-colors ${
              ok ? "cursor-pointer" : "cursor-not-allowed"
            } ${
              ok
                ? chosen
                  ? "border-blue-500 bg-[#005EF9] text-white"
                  : "border-gray-200 bg-white text-[#4D4B4C] hover:border-gray-300"
                : "border-[#E9E9EC] bg-gray-50 text-gray-400"
            }`}>
            {timeStr}
          </button>
        );
      })}
    </div>
  );
}
