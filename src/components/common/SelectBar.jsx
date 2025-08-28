import React, { useState } from "react";
import PropTypes from "prop-types";
import selectArrowIcon from "@/assets/icons/select-arrow-icon.svg";

export default function SelectBar(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("신고 분류");

  const options = [
    { text: "신고 분류", value: "default" },
    { text: "어뷰징", value: "ABUSING" },
    { text: "명의도용", value: "IDENTITY_THEFT" },
    { text: "금전적 사기/불법 행위", value: "FRAUD" },
    { text: "스팸/광고성 활동", value: "FRCOMMERCIAL_ADAUD" },
    { text: "개인정보 요구/유출", value: "PERSONAL_DATA_ABUSE" },
  ];

  const handleSelect = (option) => {
    setSelectedValue(option.text);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-[full] min-w-[150px]">
      {/* 메인 버튼/입력창 */}
      <div
        className="text-md flex w-full min-w-[180px] cursor-pointer items-center justify-between rounded-[10px] border-[1px] border-[#E6E7EA] bg-white p-2 text-center text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}>
        <span className="text-[#707070]">{selectedValue}</span>
        {/* 커스텀 화살표 아이콘 */}
        <img
          className={`h-4 w-4 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          src={selectArrowIcon}
          alt="아이콘"
        />
      </div>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <ul className="absolute top-full left-0 z-10 mt-1 w-full rounded-[10px] border border-[#E6E7EA] bg-white text-center text-gray-900 shadow-md">
          {options.map((option, index) => (
            <li
              key={index}
              className={`cursor-pointer border-b-[1px] whitespace-pre ${index === options.length ? "" : "border-gray-200"} border-b-[solid] p-2 hover:bg-gray-100`}
              onClick={() => handleSelect(option)}>
              {option.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
