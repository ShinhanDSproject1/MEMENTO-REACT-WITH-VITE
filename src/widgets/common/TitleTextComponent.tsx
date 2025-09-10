// src/components/common/TitleTextComponent.tsx
import type { FC, ReactNode } from "react";

export interface TitleTextComponentProps {
  subtitle: string;
  context: ReactNode; // 문자열 또는 JSX 모두 받을 수 있도록 ReactNode
}

const TitleTextComponent: FC<TitleTextComponentProps> = ({ subtitle, context }) => {
  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <span className="w-[30%] font-bold">{subtitle}</span>
      <span
        className={`flex-grow-1 text-[#354259] ${
          subtitle === "파일" ? "underline underline-offset-1" : ""
        }`}>
        {context}
      </span>
    </div>
  );
};

export default TitleTextComponent;
