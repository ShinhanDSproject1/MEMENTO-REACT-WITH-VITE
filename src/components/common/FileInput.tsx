// src/components/common/FileInput.tsx
import UploadIcon from "@/assets/icons/upload-icon.svg";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";

export interface FileInputProps {
  accept?: string;
  onFileChange?: (file: File) => void; // ⬅️ 옵션으로 변경
}

export default function FileInput({ accept, onFileChange }: FileInputProps) {
  const [text, setText] = useState<string>("파일 선택");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setText(file.name);
      onFileChange?.(file); // ⬅️ 있으면 호출
    }
  };

  return (
    <div>
      {/* 숨김 실제 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {/* 커스텀 버튼 */}
      <button
        type="button"
        onClick={handleButtonClick}
        aria-label="파일 선택"
        className="flex h-[8vh] max-h-[50px] min-h-[30px] w-full items-center justify-between rounded-[10px] border-[1px] border-[#E6E7EA] bg-white px-4 py-2 text-[#6C747E] hover:border-blue-400"
      >
        <span className="text-sm">{text}</span>
        <img src={UploadIcon} alt="upload-icon" />
      </button>
    </div>
  );
}
