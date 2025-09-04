import PropTypes from "prop-types";
import { useState } from "react";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function DayChips({ defaultDays = [], onChange }) {
  const [days, setDays] = useState(new Set(defaultDays));

  const toggle = (d) => {
    setDays((prev) => {
      const next = new Set(prev);
      next.has(d) ? next.delete(d) : next.add(d);
      onChange?.(Array.from(next));
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
            className={`h-12 w-12 rounded-full border shadow-[0_1px_0_rgba(17,17,17,0.02)] transition-all focus:ring-2 focus:ring-[#005EF9]/40 focus:outline-none ${active ? "!border-[#005EF9] !bg-[#005EF9] !text-white" : "border-[#E5E7ED] bg-white text-[#667085] hover:bg-[#F2F5FA]"}`}
            aria-pressed={active}
            aria-label={d}>
            {d}
          </button>
        );
      })}
    </div>
  );
}
DayChips.propTypes = { defaultDays: PropTypes.array, onChange: PropTypes.func };
