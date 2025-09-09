// src/app/providers/index.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useState } from "react";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // 원하면 사용

export default function AppProviders({ children }: PropsWithChildren) {
  // hot reload 시 인스턴스 유지용
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
