// src/components/common/SelectBar.tsx
import selectArrowIcon from "@assets/icons/icon-select-arrow.svg";
import { useState } from "react";

// 옵션 타입 정의
interface Option {
  text: string;
  value: string;
}

export default function SelectBar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>("신고 분류");

  const options: Option[] = [
    { text: "신고 분류", value: "default" },
    { text: "어뷰징", value: "ABUSING" },
    { text: "명의도용", value: "IDENTITY_THEFT" },
    { text: "금전적 사기/불법 행위", value: "FRAUD" },
    { text: "스팸/광고성 활동", value: "FRCOMMERCIAL_ADAUD" },
    { text: "개인정보 요구/유출", value: "PERSONAL_DATA_ABUSE" },
  ];

  const handleSelect = (option: Option) => {
    setSelectedValue(option.text);
    setIsOpen(false);
  };

  const selectableOptions = options.filter((option) => option.value !== "default");

  return (
    <div className="relative w-full min-w-[150px]">
      {/* 메인 버튼 */}
      <div
        className="text-md flex w-full min-w-[180px] cursor-pointer items-center justify-between rounded-[10px] border border-[#E6E7EA] bg-white p-2 text-center text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        onClick={() => setIsOpen((prev) => !prev)}>
        <span className="text-[#707070]">{selectedValue}</span>
        <img
          className={`h-4 w-4 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          src={selectArrowIcon}
          alt="select arrow"
        />
      </div>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <ul className="absolute top-full left-0 z-10 mt-1 w-full rounded-[10px] border border-[#E6E7EA] bg-white text-center text-gray-900 shadow-md">
          {selectableOptions.map((option, index) => (
            <li
              key={option.value}
              className={`cursor-pointer border-b p-2 whitespace-pre hover:bg-gray-100 ${
                index === selectableOptions.length - 1 ? "" : "border-gray-200"
              }`}
              onClick={() => handleSelect(option)}>
              {option.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
