import type { PropsWithChildren } from "react";
import QueryProvider from "./QueryProvider";

export default function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      {/* <AuthProvider>{children}</AuthProvider> */}
      {children}
    </QueryProvider>
  );
}
