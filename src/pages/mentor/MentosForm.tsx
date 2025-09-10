import Button from "@/widgets/common/Button";
import { SimpleEditor } from "@/widgets/common/tiptap-templates/simple/simple-editor";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";

export type MentosFormValues = {
  title: string;
  content: string;
  price: string;
  location: string;
  category?: string;
  fileName?: string;
};

interface MentosFormProps {
  mode?: "create" | "edit";
  initialValues?: Partial<MentosFormValues>;
  onSubmit?: (values: MentosFormValues) => Promise<void> | void;
}

export default function MentosForm({
  mode = "create",
  initialValues = {},
  onSubmit,
}: MentosFormProps) {
  const [fileName, setFileName] = useState<string>(
    initialValues.fileName ?? ""
  );
  const [form, setForm] = useState<MentosFormValues>({
    title: initialValues.title ?? "",
    content: initialValues.content ?? "",
    price: initialValues.price ?? "",
    location: initialValues.location ?? "",
    category: initialValues.category ?? "",
    fileName: initialValues.fileName ?? "",
  });

  useEffect(() => {
    setForm({
      title: initialValues.title ?? "",
      content: initialValues.content ?? "",
      price: initialValues.price ?? "",
      location: initialValues.location ?? "",
      category: initialValues.category ?? "",
      fileName: initialValues.fileName ?? "",
    });
    setFileName(initialValues.fileName ?? "");
  }, [initialValues]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setForm((prev) => ({ ...prev, fileName: file.name }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit({ ...form, fileName });
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {/* 제목 */}
      <div className="grid grid-cols-[56px_1fr] items-start gap-3">
        <label htmlFor="title" className="pl-2 leading-7 font-bold text-[#333]">
          제목
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
          required
        />
      </div>

      {/* 분류 */}
      <div className="grid grid-cols-[56px_1fr] items-start gap-3">
        <label
          htmlFor="category"
          className="pl-2 leading-7 font-bold whitespace-pre text-[#333]"
        >
          분류
        </label>
        <input
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
          required
        />
      </div>

      {/* 내용 */}
      <div className="grid grid-cols-[56px_1fr] items-start gap-3">
        <label className="pl-2 leading-7 font-bold text-[#333]">내용</label>
      </div>
      <div className="h-80 w-full overflow-hidden rounded-lg border border-[#e5e7ed]">
        <SimpleEditor
          value={form.content}
          onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
        />
      </div>

      {/* 사진 */}
      <div className="grid grid-cols-[56px_1fr] items-start gap-3">
        <span className="pl-2 leading-7 font-bold text-[#333]">사진</span>
        <div className="flex w-full items-center gap-3">
          <label className="flex-1 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 outline-none placeholder:text-slate-400 focus-within:border-[#2F6CFF] focus-within:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              id="mentos-image"
            />
            <span
              className={`block truncate ${fileName ? "text-slate-700" : "text-slate-400"}`}
            >
              {fileName || "이미지 업로드"}
            </span>
          </label>

          <label
            htmlFor="mentos-image"
            className="cursor-pointer rounded-xl bg-[#1161FF] px-4 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#0C2D62]"
          >
            파일 선택
          </label>
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
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
          placeholder="가격을 입력해주세요."
        />
      </div>

      {/* 제출 버튼 */}
      <div className="mt-6 flex justify-center">
        <Button type="submit" variant="primary" size="lg" className="w-full">
          {mode === "edit" ? "수정완료" : "생성하기"}
        </Button>
      </div>
    </form>
  );
}
