// 생성 페이지
import { useState } from "react";
import { CommonModal } from "@/components/common/CommonModal";
import { SimpleEditor } from "@/components/common/tiptap-templates/simple/simple-editor";
import Button from "@/components/common/Button";
import MainHeader from "@/components/MainHeader";

export default function CreateMentos() {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-hidden bg-[#f5f6f8] font-sans antialiased">
      <section className="w-[375px] overflow-x-hidden rounded-xl bg-white px-4 py-5 shadow">
        <MainHeader />
        <h1 className="font-WooridaumB mt-6 mb-15 pl-2 text-[20px] font-bold">멘토링 생성하기</h1>
        <CommonModal
          type="createMentos"
          isOpen={isOpen}
          onConfirm={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
          onSubmit={() => {}}
          modalData={{}}
        />
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-[56px_1fr] items-start gap-3">
            <label htmlFor="title" className="pl-2 leading-7 font-bold text-[#333]">
              제목
            </label>
            <input
              id="title"
              className="w-full rounded-lg border border-[#e5e7ed] px-2 py-2 text-sm outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-[56px_1fr] items-start gap-3">
            <label className="pl-2 leading-7 font-bold text-[#333]">내용</label>
            <div className="w-full overflow-hidden rounded-lg border border-[#e5e7ed]">
              <SimpleEditor />
            </div>
          </div>
          <div className="grid grid-cols-[56px_1fr] items-start gap-3">
            <span className="pl-2 leading-7 font-bold text-[#333]">사진</span>
            <div className="flex w-full flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-[#e5e7ed] px-2 py-2 text-sm"
              />
              {fileName && <span className="text-sm text-gray-500">선택됨: {fileName}</span>}
            </div>
          </div>
          <div className="grid grid-cols-[56px_1fr] items-start gap-3">
            <label htmlFor="price" className="pl-2 leading-7 font-bold text-[#333]">
              가격
            </label>
            <input
              id="price"
              inputMode="numeric"
              className="w-full rounded-lg border border-[#e5e7ed] px-2 py-2 text-sm outline-none"
              placeholder="가격을 입력해주세요."
            />
          </div>
          <div className="grid grid-cols-[56px_1fr] items-start gap-3">
            <label htmlFor="region" className="pl-2 leading-7 font-bold text-[#333]">
              장소
            </label>
            <input
              id="region"
              className="w-full rounded-lg border border-[#e5e7ed] px-2 py-2 text-sm outline-none"
              placeholder="시/군/구"
              required
            />
          </div>{" "}
          <div className="mt-6 flex justify-center">
            <Button type="submit" variant="primary" size="lg" className="w-full">
              생성하기
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
