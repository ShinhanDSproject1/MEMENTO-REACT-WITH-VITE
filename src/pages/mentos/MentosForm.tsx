// src/pages/MentosForm.tsx
import Button from "@/widgets/common/Button";
import { SimpleEditor } from "@/widgets/common/tiptap-templates/simple/simple-editor";
import { CommonModal } from "@widgets/common";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

// 폼 값 타입
export interface MentosFormValues {
  title: string;
  content: string;
  price: string; // 숫자 처리하면 number로 바꿔도 됩니다
  location: string;
  fileName?: string;
}

// 컴포넌트 props
export interface MentosFormProps {
  mode?: "create" | "edit";
  initialValues?: Partial<MentosFormValues>;
  onSubmit?: (values: MentosFormValues) => Promise<void> | void;
}

export default function MentosForm({
  mode = "create",
  initialValues = {},
  onSubmit,
}: MentosFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState<string>(initialValues.fileName ?? "");
  const [form, setForm] = useState<MentosFormValues>({
    title: initialValues.title ?? "",
    content: initialValues.content ?? "",
    price: initialValues.price ?? "",
    location: initialValues.location ?? "",
    fileName: initialValues.fileName ?? "",
  });

  useEffect(() => {
    setForm({
      title: initialValues.title ?? "",
      content: initialValues.content ?? "",
      price: initialValues.price ?? "",
      location: initialValues.location ?? "",
      fileName: initialValues.fileName ?? "",
    });
    setFileName(initialValues.fileName ?? "");
  }, [initialValues]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }) as MentosFormValues);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setForm((prev) => ({ ...prev, fileName: file.name }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: MentosFormValues = { ...form, fileName };
    await onSubmit?.(payload);
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
      />

      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* 제목 */}
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

        {/* 내용 (SimpleEditor가 value/onChange를 지원하는 경우) */}
        <div className="grid grid-cols-[56px_1fr] items-start gap-3">
          <label className="pl-2 leading-7 font-bold text-[#333]">내용</label>
          <div className="w-full overflow-hidden rounded-lg border border-[#e5e7ed]">
            <SimpleEditor
              // ❗ SimpleEditor가 value/onChange를 지원하도록 래퍼를 쓰고 있다면 그대로 사용
              // 만약 지원하지 않는다면: 현재 HTML을 setForm에서만 관리하지 말고,
              // 에디터 내부 content를 사용하거나, wrapper 컴포넌트를 만들어 주세요.
              value={form.content}
              onChange={(html: string) => setForm((prev) => ({ ...prev, content: html }))}
            />
          </div>
        </div>

        {/* 사진 */}
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

        {/* 가격 */}
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

        {/* 장소 */}
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

        {/* 버튼 */}
        <div className="mt-6 flex justify-center">
          <Button type="submit" variant="primary" size="lg" className="w-full">
            {mode === "edit" ? "수정완료" : "생성하기"}
          </Button>
        </div>
      </form>
    </>
  );
}
