// src/components/common/CardSection.tsx
import type { ReactNode } from "react";

interface CardSectionProps {
  className?: string;
  children: ReactNode;
}

export default function CardSection({
  className = "",
  children,
}: CardSectionProps) {
  return (
    <div
      className={`w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
