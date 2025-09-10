// src/components/common/DateField.tsx
import { ko, type Locale } from "date-fns/locale"; // ✅ import 스타일
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface DateFieldProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  // react-datepicker의 다른 props도 모두 허용
  restProps?: Omit<DatePicker, "selected" | "onChange" | "className">;
}

export default function DateField({ selected, onChange, className = "", ...rest }: DateFieldProps) {
  const [active, setActive] = useState(false);

  const base =
    "h-9 w-full min-w-0 rounded-lg px-3 font-medium text-[16px] sm:text-sm focus:outline-none";
  const border = active
    ? "border border-[#005EF9] ring-2 ring-[#005EF9]"
    : "border border-gray-300";

  return (
    <div className="relative inline-block w-full">
      <DatePicker
        selected={selected}
        onChange={onChange}
        locale={ko as Locale} // ✅ 캐스팅
        dateFormat="yyyy년 MM월 dd일"
        placeholderText="날짜 선택"
        showPopperArrow={false}
        popperPlacement="bottom-start"
        // react-datepicker에서 popperProps는 object 타입 → any로 캐스팅 필요
        popperProps={
          [
            { name: "offset", options: { offset: [0, 55] } },
            { name: "preventOverflow", options: { padding: 8, altAxis: true } },
          ] as any
        }
        shouldCloseOnSelect
        className={`${base} bg-white text-[#121418] ${border} ${className}`}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        popperClassName="z-50"
        wrapperClassName="w-full"
        {...rest}
      />
    </div>
  );
}
