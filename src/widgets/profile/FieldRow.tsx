// src/components/common/FieldRow.tsx
import type { ReactNode } from "react";

interface FieldRowProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}

export default function FieldRow({ label, htmlFor, children }: FieldRowProps) {
  return (
    <div className="mb-4 flex min-w-0 items-center gap-2">
      <label
        htmlFor={htmlFor}
        className="w-24 shrink-0 text-xs font-semibold text-[#121418] md:text-sm">
        {label}
      </label>
      {children}
    </div>
  );
}
