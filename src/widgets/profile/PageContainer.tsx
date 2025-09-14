// src/components/common/PageContainer.tsx
import type { ReactNode } from "react";

interface PageContainerProps {
  className?: string;
  children: ReactNode;
}

export default function PageContainer({ className = "", children }: PageContainerProps) {
  return <div className={`mx-auto w-full px-4 ${className}`}>{children}</div>;
}
