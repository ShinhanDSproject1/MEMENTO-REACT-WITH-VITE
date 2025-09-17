// src/components/common/SelectBar.tsx
import selectArrowIcon from "@assets/icons/icon-select-arrow.svg";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Option {
  text: string;
  value: string;
}

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  options?: Option[];
  placeholder?: string;
};

export default function SelectBar({ value, onChange, options, placeholder = "신고 분류" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(value ?? "default");

  const btnRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null); // ✅ 추가
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const opts: Option[] = options ?? [
    { text: "신고 분류", value: "default" },
    { text: "어뷰징", value: "ABUSING" },
    { text: "명의도용", value: "IDENTITY_THEFT" },
    { text: "금전적 사기/불법 행위", value: "FRAUD" },
    { text: "스팸/광고성 활동", value: "COMMERCIAL_AD" },
    { text: "개인정보 요구/유출", value: "PERSONAL_DATA_ABUSE" },
  ];

  // 외부 value 동기화(컨트롤 모드 지원)
  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const selectedText = opts.find((o) => o.value === internalValue)?.text ?? placeholder;
  const selectableOptions = opts.filter((o) => o.value !== "default");

  // 버튼 기준 고정 위치 계산
  const computePosition = () => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMenuStyle({
      position: "fixed",
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 2147483647, // 최상단
    });
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    computePosition();

    const onScroll = () => computePosition();
    const onResize = () => computePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen]);

  // 바깥 클릭 닫기 (버튼/메뉴 내부 클릭은 제외)
  useEffect(() => {
    if (!isOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const btn = btnRef.current;
      const menu = menuRef.current;

      if (btn?.contains(target)) return; // 버튼 내부 클릭은 유지
      if (menu?.contains(target)) return; // ✅ 드롭다운 내부 클릭은 유지
      setIsOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [isOpen]);

  const handleSelect = (opt: Option) => {
    setInternalValue(opt.value); // 내부 표시 업데이트
    onChange?.(opt.value); // 부모로 값 전달
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative w-full min-w-[150px]">
        {/* 메인 버튼 */}
        <div
          ref={btnRef}
          className="text-md flex w-full min-w-[180px] cursor-pointer items-center justify-between rounded-[10px] border border-[#E6E7EA] bg-white p-2 text-center text-gray-900 outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => setIsOpen((prev) => !prev)}>
          <span className={internalValue === "default" ? "text-[#707070]" : ""}>
            {selectedText}
          </span>
          <img
            className={`h-4 w-4 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
            src={selectArrowIcon}
            alt="select arrow"
          />
        </div>
      </div>

      {/* 드롭다운: Portal */}
      {isOpen &&
        createPortal(
          <ul
            ref={menuRef} // ✅ 추가
            style={{ ...menuStyle, position: "fixed", zIndex: 2147483647, pointerEvents: "auto" }} // ✅ 클릭 가능 보장
            className="max-h-[50vh] overflow-auto rounded-[10px] border border-[#E6E7EA] bg-white text-center text-gray-900 shadow-lg">
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
          </ul>,
          document.body,
        )}
    </>
  );
}
