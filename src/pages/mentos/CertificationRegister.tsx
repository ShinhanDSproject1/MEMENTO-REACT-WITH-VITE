// src/pages/CertificationRegister.tsx
import Button from "@/widgets/common/Button";
import { FileInput, Label } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function CertificationRegister() {
  const navigate = useNavigate();

  return (
    <div className="flex h-[70vh] w-full flex-col justify-between gap-4 bg-white p-4 py-4">
      {/* 제목 */}
      <div className="flex w-full">
        <p className="font-WooridaumB text-black">
          보유중인 <span className="font-WooridaumB text-[#005EF9]">자격증</span>을 <br />
          업로드해주세요!
        </p>
      </div>

      {/* 업로드 영역 */}
      <div className="flex w-full items-center justify-center">
        <Label
          htmlFor="dropzone-file"
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5
                   5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5
                   5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8
                   8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <FileInput id="dropzone-file" className="hidden" required />
        </Label>
      </div>

      {/* 버튼 */}
      <div className="flex flex-col items-center justify-center gap-2">
        <Button
          onClick={() => navigate("/mento/certification/inprogress")}
          variant="primary"
          className="font-WooridaumB w-full px-8 py-4 font-bold"
          size="xl">
          추가하기
        </Button>
        <Button
          onClick={() => navigate("/mento")}
          variant="cancelGray"
          className="font-WooridaumB w-full px-8 py-4 font-bold"
          size="xl">
          돌아가기
        </Button>
      </div>
    </div>
  );
}
