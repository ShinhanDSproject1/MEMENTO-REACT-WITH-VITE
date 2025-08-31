// 폼 + 모달
import { useEffect, useState } from "react";
import { CommonModal } from "@/components/common/CommonModal";
import { SimpleEditor } from "@/components/common/tiptap-templates/simple/simple-editor";
import Button from "@/components/common/Button";
import PropTypes from "prop-types";

export default function MentosForm({ mode = "create", initialValues = {}, onSubmit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState(initialValues.fileName || "");
  const [form, setForm] = useState({
    title: initialValues.title || "",
    content: initialValues.content || "",
    price: initialValues.price || "",
    location: initialValues.location || "",
  });

  useEffect(() => {
    setForm({
      title: initialValues.title || "",
      content: initialValues.content || "",
      price: initialValues.price || "",
      location: initialValues.location || "",
    });
    setFileName(initialValues.fileName || "");
  }, [initialValues]);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit?.({ ...form, fileName });
    setIsOpen(true);
  };

  return (
    <>
      <CommonModal
        type={mode === "edit" ? "updateMentos" : "createMentos"}
        isOpen={isOpen}
        onConfirm={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        onSubmit={() => {}}
        modalData={{}}
        description={mode === "edit" ? "수정이 완료되었습니다!" : "생성이 완료되었습니다!"}
      />
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="grid grid-cols-[56px_1fr] items-start gap-3">
          <label htmlFor="title" className="pl-2 leading-7 font-bold text-[#333]">
            제목
          </label>
          <input
            id="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#e5e7ed] px-2 py-2 text-sm outline-none"
            required
          />
        </div>
        <div className="grid grid-cols-[56px_1fr] items-start gap-3">
          <label className="pl-2 leading-7 font-bold text-[#333]">내용</label>
          <div className="w-full overflow-hidden rounded-lg border border-[#e5e7ed]">
            <SimpleEditor
              value={form.content}
              onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
            />
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
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#e5e7ed] px-2 py-2 text-sm outline-none"
            placeholder="가격을 입력해주세요."
          />
        </div>
        <div className="grid grid-cols-[56px_1fr] items-start gap-3">
          <label htmlFor="location" className="pl-2 leading-7 font-bold text-[#333]">
            장소
          </label>
          <input
            id="location"
            value={form.location}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#e5e7ed] px-2 py-2 text-sm outline-none"
            placeholder="시/군/구"
            required
          />
        </div>
        <div className="mt-6 flex justify-center">
          <Button type="submit" variant="primary" size="lg" className="w-full">
            {mode === "edit" ? "수정완료" : "생성하기"}
          </Button>
        </div>
      </form>
    </>
  );
}

MentosForm.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]),
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
};
