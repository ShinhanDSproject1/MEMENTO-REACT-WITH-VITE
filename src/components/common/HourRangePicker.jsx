import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import HourSelect from "./HourSelect";

export default function HourRangePicker({ value, onChange }) {
  const [startH, setStartH] = useState(value?.start ?? 10);
  const [endH, setEndH] = useState(value?.end ?? 18);

  useEffect(() => onChange?.({ start: startH, end: endH }), [startH, endH, onChange]);

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      <HourSelect
        label="시작 시간"
        value={startH}
        onChange={(h) => {
          setStartH(h);
          if (h > endH) setEndH(h);
        }}
      />
      <div className="text-center text-slate-400 sm:px-2">~</div>
      <HourSelect
        label="종료 시간"
        value={endH}
        onChange={(h) => {
          setEndH(h);
          if (h < startH) setStartH(h);
        }}
      />
    </div>
  );
}
HourRangePicker.propTypes = {
  value: PropTypes.shape({ start: PropTypes.number, end: PropTypes.number }),
  onChange: PropTypes.func,
};
