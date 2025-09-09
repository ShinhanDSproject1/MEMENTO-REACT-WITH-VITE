// src/components/common/HourSelect.tsx
import { useEffect, useRef, useState } from "react";

function useOutsideClose(setOpen: (v: boolean) => void) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const el = ref.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [setOpen]);

  return ref;
}

export interface HourSelectProps {
  /** 라벨 텍스트 (버튼 상단 작은 글씨) */
  label?: string;
  /** 선택된 시간(시) */
  value: number;
  /** 시간 변경 콜백 */
  onChange?: (h: number) => void;
  /** 선택 가능 시작 시각 */
  startHour?: number; // 기본 10
  /** 선택 가능 종료 시각 */
  endHour?: number; // 기본 22
}

export default function HourSelect({
  label = "Start with",
  value,
  onChange,
  startHour = 10,
  endHour = 22,
}: HourSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(setOpen);

  // 방어: 범위가 뒤집히면 바로 잡기
  const start = Math.min(startHour, endHour);
  const end = Math.max(startHour, endHour);

  const hours = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="relative w-full sm:w-auto" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-14 w-full items-center justify-between rounded-[14px] border border-[#E5E7ED] bg-white px-4 shadow-[0_1px_0_rgba(17,17,17,0.02)] hover:border-[#CBD5E1] focus:outline-none ${open ? "ring-2 ring-[#005EF9]" : "focus:ring-2 focus:ring-[#005EF9]/60"}`}
      >
        <div className="flex min-w-0 flex-col items-start">
          <span className="text-[12px] font-medium text-[#7A8699]">
            {label}
          </span>
          <span className="text-[16px] font-semibold text-[#0F172A]">
            {value}시
          </span>
        </div>
        <svg
          className="h-4 w-4 text-slate-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[#E5E7ED] bg-white shadow-lg sm:w-44">
          <ul
            className="max-h-64 overflow-y-auto py-2"
            role="listbox"
            aria-label="시간 선택"
          >
            {hours.map((h) => (
              <li key={h}>
                <button
                  type="button"
                  role="option"
                  aria-selected={h === value}
                  onClick={() => {
                    onChange?.(h);
                    setOpen(false);
                  }}
                  className={`flex w-full justify-between px-4 py-2 text-[15px] ${
                    h === value
                      ? "font-bold text-[#005EF9]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{h}시</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
