// src/components/common/HourRangePicker.tsx
import { useEffect, useState } from "react";
import HourSelect from "./HourSelect";

export interface HourRange {
  start: number;
  end: number;
}

export interface HourRangePickerProps {
  value?: HourRange;
  onChange?: (range: HourRange) => void;
}

export default function HourRangePicker({
  value,
  onChange,
}: HourRangePickerProps) {
  const [startH, setStartH] = useState<number>(value?.start ?? 10);
  const [endH, setEndH] = useState<number>(value?.end ?? 18);

  useEffect(() => {
    onChange?.({ start: startH, end: endH });
  }, [startH, endH, onChange]);

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      <HourSelect
        label="시작 시간"
        value={startH}
        onChange={(h: number) => {
          setStartH(h);
          if (h > endH) setEndH(h);
        }}
      />
      <div className="text-center text-slate-400 sm:px-2">~</div>
      <HourSelect
        label="종료 시간"
        value={endH}
        onChange={(h: number) => {
          setEndH(h);
          if (h < startH) setStartH(h);
        }}
      />
    </div>
  );
}
