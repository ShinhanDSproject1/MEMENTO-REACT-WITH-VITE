import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches);
    handler(mq);
    if ("addEventListener" in mq) mq.addEventListener("change", handler as any);
    else (mq as any).addListener(handler as any);
    return () => {
      if ("removeEventListener" in mq) mq.removeEventListener("change", handler as any);
      else (mq as any).removeListener(handler as any);
    };
  }, [breakpoint]);
  return isMobile;
}
