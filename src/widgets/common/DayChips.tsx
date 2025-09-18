import { useEffect, useState } from "react";

export const DAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;
export type Day = (typeof DAYS)[number];

export interface DayChipsProps {
  defaultDays?: Day[];
  onChange?: (days: Day[]) => void;
}

export default function DayChips({ defaultDays = [], onChange }: DayChipsProps) {
  const [days, setDays] = useState<Set<Day>>(() => new Set(defaultDays));

  useEffect(() => {
    setDays(new Set(defaultDays));
  }, [defaultDays]);

  useEffect(() => {
    onChange?.(Array.from(days));
  }, [days, onChange]);

  const toggle = (d: Day) => {
    setDays((prev) => {
      const next = new Set(prev);
      next.has(d) ? next.delete(d) : next.add(d);
      return next;
    });
  };

  return (
    <div className="flex justify-between gap-2">
      {DAYS.map((d) => {
        const active = days.has(d);
        return (
          <button
            key={d}
            type="button"
            onClick={() => toggle(d)}
            className={`h-12 w-12 rounded-full border shadow transition-all ${
              active
                ? "!border-[#005EF9] !bg-[#005EF9] !text-white"
                : "border-[#E5E7ED] bg-white text-[#667085] hover:bg-[#F2F5FA]"
            }`}
            aria-pressed={active}
            aria-label={d}>
            {d}
          </button>
        );
      })}
    </div>
  );
}
