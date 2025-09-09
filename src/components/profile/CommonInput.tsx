// src/components/common/CommonInput.tsx
import { forwardRef, type InputHTMLAttributes } from "react";

type ValidationState = "ok" | "error" | undefined;
type Tone = "default" | "light";

export interface CommonInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "disabled"> {
  className?: string;
  editable?: boolean;
  /** 유효성 상태에 따라 강조 색 변경 */
  validation?: ValidationState;
  /** 밝은 톤 배경 등 스타일 변형 */
  tone?: Tone;
}

const CommonInput = forwardRef<HTMLInputElement, CommonInputProps>(
  (
    { className = "", editable = true, validation, tone = "default", ...props },
    ref
  ) => {
    const base = "w-full rounded-lg px-3 py-2 text-sm outline-none";
    const stateCls = editable
      ? "border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
      : "cursor-not-allowed border border-gray-300 bg-gray-200 text-gray-700";
    const toneCls = tone === "light" ? "bg-gray-50" : "";
    const valCls =
      validation === "ok"
        ? "border-green-500 focus:ring-green-500"
        : validation === "error"
          ? "border-red-500 focus:ring-red-500"
          : "";

    return (
      <input
        ref={ref}
        {...props}
        disabled={!editable}
        aria-invalid={validation === "error" ? true : undefined}
        className={[base, stateCls, toneCls, valCls, className]
          .join(" ")
          .trim()}
      />
    );
  }
);

export default CommonInput;
