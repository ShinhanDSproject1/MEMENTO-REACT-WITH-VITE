import { useEffect, useState } from "react";
import { SimpleEditor } from "@/components/common/tiptap-templates/simple/simple-editor";
import Button from "@/components/common/Button";
import PropTypes from "prop-types";

export default function MentosForm({ mode = "create", initialValues = {}, onSubmit }) {
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
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
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
        <div className="flex w-full items-center gap-3">
          <label className="flex-1 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 outline-none placeholder:text-slate-400 focus-within:border-[#2F6CFF] focus-within:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              id="mentos-image"
            />
            <span className={`block truncate ${fileName ? "text-slate-700" : "text-slate-400"}`}>
              {fileName || "이미지 업로드"}
            </span>
          </label>

          <label
            htmlFor="mentos-image"
            className="cursor-pointer rounded-xl bg-[#1161FF] px-4 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#0C2D62]">
            파일 선택
          </label>
        </div>
      </div>

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
      <div className="mt-6 flex justify-center">
        <Button type="submit" variant="primary" size="lg" className="w-full">
          {mode === "edit" ? "수정완료" : "생성하기"}
        </Button>
      </div>
    </form>
  );
}

MentosForm.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]),
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
};
