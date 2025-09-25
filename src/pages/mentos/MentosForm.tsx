// src/pages/MentosForm.tsx
import Button from "@/widgets/common/Button";
import { SimpleEditor } from "@/widgets/common/tiptap-templates/simple/simple-editor";
import { CommonModal } from "@widgets/common";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

/* ── 카테고리 옵션 (요구사항: 1~4) ───────────────────────── */
const CATEGORY_OPTIONS = [
  { label: "소비 패턴", value: "1" },
  { label: "생활\n노하우", value: "2" }, // Changed
  { label: "저축 방식", value: "3" },
  { label: "자산 증식", value: "4" },
] as const;

// 폼 값 타입
export interface MentosFormValues {
  title: string;
  content: string;
  price: string; // UI에서는 문자열로 관리, API 보낼 때 Number 변환
  location: string;
  category: string; // "1" | "2" | "3" | "4"
  fileName?: string;
  imageFile?: File | null; // 파일 객체
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
    category: initialValues.category ?? "",
    fileName: initialValues.fileName ?? "",
    imageFile: initialValues.imageFile ?? null,
  });

  // initialValues 변경 시 동기화
  useEffect(() => {
    setForm({
      title: initialValues.title ?? "",
      content: initialValues.content ?? "",
      price: initialValues.price ?? "",
      location: initialValues.location ?? "",
      category: initialValues.category ?? "",
      fileName: initialValues.fileName ?? "",
      imageFile: initialValues.imageFile ?? null,
    });
    setFileName(initialValues.fileName ?? "");
  }, [initialValues]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, imageFile: file, fileName: file?.name ?? "" }));
    setFileName(file?.name ?? "");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 간단 검증
    if (!form.title.trim()) return alert("제목을 입력해 주세요.");
    if (!form.content.trim()) return alert("내용을 입력해 주세요.");
    if (!form.category.trim()) return alert("분류를 선택해 주세요.");
    if (!form.price.trim()) return alert("가격을 입력해 주세요.");
    if (!form.location.trim()) return alert("장소를 입력해 주세요.");

    const payload: MentosFormValues = { ...form, fileName };
    await onSubmit?.(payload);

    // 폼 자체에서 완료 모달을 띄우려면 유지
    setIsOpen(true);
  };

  // (선택) 가격 표시를 3자리 콤마로 포맷하고 내부에는 숫자만 저장하고 싶다면:
  const formatPrice = (value: string) => {
    const numeric = value.replace(/[^0-9]/g, "");
    if (!numeric) return "";
    return Number(numeric).toLocaleString();
  };
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/[^0-9]/g, "");
    setForm((prev) => ({ ...prev, price: numeric }));
  };

  return (
    <>
      {/* 완료 모달 (필요 없으면 제거하고 상위에서 관리하세요) */}
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

        {/* 분류(카테고리) : 버튼 한 줄 */}
        <div className="grid grid-cols-[56px_1fr] items-center gap-3">
          <label className="pl-2 font-bold text-[#333]">분류</label>
          <div className="flex w-full justify-between gap-2">
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, category: opt.value }))}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold whitespace-pre-line transition-colors ${
                  // Changed
                  form.category === opt.value
                    ? "bg-[#1161FF] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 내용 */}
        <div className="grid grid-cols-[56px_1fr] items-start gap-3">
          <label className="pl-2 leading-7 font-bold text-[#333]">내용</label>
          <div className="w-full overflow-hidden rounded-lg border border-[#e5e7ed]">
            <SimpleEditor
              value={form.content}
              onChange={(html: string) => setForm((prev) => ({ ...prev, content: html }))}
            />
          </div>
        </div>

        {/* 사진: 파일명 + 버튼 한 줄 고정 */}
        <div className="grid grid-cols-[56px_minmax(0,1fr)_112px] items-center gap-3">
          <span className="pl-2 leading-7 font-bold text-[#333]">사진</span>

          {/* 숨긴 파일 인풋 */}
          <input
            id="mentos-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* 파일명 표시 영역 */}
          <div className="w-full min-w-0 overflow-hidden rounded-lg border border-[#e5e7ed] bg-white px-4 py-3 text-sm text-ellipsis whitespace-nowrap text-slate-500">
            <span className={`block truncate ${fileName ? "text-slate-700" : "text-slate-400"}`}>
              {fileName || "이미지 업로드"}
            </span>
          </div>

          {/* 파일 선택 버튼 (오른쪽 고정폭) */}
          <label
            htmlFor="mentos-image"
            className="w-[112px] shrink-0 cursor-pointer justify-self-end rounded-xl bg-[#1161FF] px-4 py-3 text-center text-sm font-extrabold text-white transition-colors hover:bg-[#0C2D62]">
            파일 선택
          </label>
        </div>

        {/* 가격 */}
        <div className="grid grid-cols-[56px_1fr] items-start gap-3">
          <label htmlFor="price" className="pl-2 leading-7 font-bold text-[#333]">
            가격
          </label>
          <input
            id="price"
            inputMode="numeric"
            value={formatPrice(form.price)} // 화면 표시용
            onChange={handlePriceChange} // 내부는 숫자만
            className="w-full rounded-lg border border-[#e5e7ed] bg-white px-2 py-2 text-sm outline-none"
            placeholder="가격을 입력해주세요."
            required
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

        {/* 제출 버튼 */}
        <div className="mt-6 flex justify-center">
          <Button type="submit" variant="primary" size="lg" className="w-full">
            {mode === "edit" ? "수정완료" : "생성하기"}
          </Button>
        </div>
      </form>
    </>
  );
}
