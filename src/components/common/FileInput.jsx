import React, { useRef } from "react";
import PropTypes from "prop-types";
import UploadIcon from "@/assets/icons/upload-icon.png";

function FileInput({ accept, onFileChange }) {
  // 실제 input 엘리먼트에 접근하기 위한 ref 생성
  const fileInputRef = useRef(null);

  // 버튼 클릭 시 숨겨진 input을 클릭
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // 파일이 선택되었을 때 실행될 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && onFileChange) {
      onFileChange(file);
    }
  };

  return (
    <div>
      {/* 1. 실제 파일 입력 요소를 숨깁니다 */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden" // Tailwind CSS의 hidden 클래스
      />
      {/* 2. 사용자에게 보일 커스텀 버튼 */}
      <button
        type="button"
        onClick={handleButtonClick}
        className="flex h-[8vh] max-h-[50px] min-h-[30px] w-full items-center justify-between rounded-[10px] border-[1px] border-[#E6E7EA] bg-white px-4 py-2 text-[#6C747E] hover:border-blue-400">
        <span>파일 선택</span>
        <img src={UploadIcon} alt="upload-icon" />
      </button>
    </div>
  );
}

FileInput.propTypes = {
  accept: PropTypes.string,
  onFileChange: PropTypes.func.isRequired,
};

export default FileInput;
