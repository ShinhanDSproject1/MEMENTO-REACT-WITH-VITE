import { useState } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import ko from "date-fns/locale/ko";
import "react-datepicker/dist/react-datepicker.css";

export default function DateField({ selected = null, onChange, className = "", ...rest }) {
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
        locale={ko}
        dateFormat="yyyy년 MM월 dd일"
        placeholderText="날짜 선택"
        showPopperArrow={false}
        popperPlacement="bottom-start"
        popperProps={[
          { name: "offset", options: { offset: [0, 55] } },
          { name: "preventOverflow", options: { padding: 8, altAxis: true } },
        ]}
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

DateField.propTypes = {
  selected: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.oneOf([null])]),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};
