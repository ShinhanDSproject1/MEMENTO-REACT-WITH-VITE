// src/components/ui/SnapCarousel.tsx
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type UIEvent,
} from "react";

interface ArrowButtonProps {
  dir?: "left" | "right";
  onClick?: () => void;
  disabled?: boolean;
}

function ArrowButton({ dir = "left", onClick, disabled }: ArrowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "이전" : "다음"}
      className={[
        "grid h-9 w-9 place-items-center rounded-full border border-slate-300 bg-white/80 shadow-sm backdrop-blur",
        "hover:bg-white disabled:cursor-not-allowed disabled:opacity-40",
      ].join(" ")}
    >
      <span className="text-slate-600 select-none">
        {dir === "left" ? "‹" : "›"}
      </span>
    </button>
  );
}

export interface SnapCarouselProps {
  children: ReactNode;
  className?: string;
  arrowInset?: number; // 화살표가 안쪽으로 들어오는 여백(px)
  arrowSize?: number; // 화살표 버튼 가로폭(px)
}

export default function SnapCarousel({
  children,
  className = "",
  arrowInset = 8,
  arrowSize = 36,
}: SnapCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [centers, setCenters] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);

  const gutter = arrowInset + arrowSize;

  const getNodes = (el: HTMLElement) => {
    const snapItems = el.querySelectorAll<HTMLElement>(".snap-item");
    return snapItems.length
      ? Array.from(snapItems)
      : (Array.from(el.children) as HTMLElement[]);
  };

  // 각 카드의 중심 스크롤 위치 계산
  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const nodes = getNodes(el);
    if (!nodes.length) {
      setCenters([]);
      setIdx(0);
      return;
    }

    const viewW = el.clientWidth;
    const paddingLeft = gutter;

    const c = nodes.map((n) => {
      const left = n.offsetLeft;
      const w = n.offsetWidth;
      const centerLeft = left - (viewW - w) / 2 + (paddingLeft - gutter / 2);
      return Math.max(0, centerLeft);
    });
    setCenters(c);

    // 현재 스크롤과 가장 가까운 카드 찾기
    const cur = el.scrollLeft;
    let nearest = 0;
    let best = Infinity;
    c.forEach((x, i) => {
      const d = Math.abs(cur - x);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setIdx(nearest);
  }, [gutter]);

  useEffect(() => {
    let ro: ResizeObserver | undefined;
    let mo: MutationObserver | undefined;

    measure();

    if ("ResizeObserver" in window && trackRef.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(trackRef.current);
    }

    if ("MutationObserver" in window && trackRef.current) {
      mo = new MutationObserver(measure);
      mo.observe(trackRef.current, { childList: true, subtree: true });
    }

    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    const id = requestAnimationFrame(measure);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(id);
      ro?.disconnect();
      mo?.disconnect();
    };
  }, [measure]);

  // 스크롤 중 중앙에 가장 가까운 카드 찾기
  const onScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      if (centers.length === 0) return;
      const cur = e.currentTarget.scrollLeft;
      let nearest = 0;
      let best = Infinity;
      centers.forEach((x, i) => {
        const d = Math.abs(cur - x);
        if (d < best) {
          best = d;
          nearest = i;
        }
      });
      setIdx(nearest);
    },
    [centers]
  );

  const scrollToIndex = (i: number) => {
    const el = trackRef.current;
    if (!el || i < 0 || i >= centers.length) return;
    el.scrollTo({ left: centers[i], behavior: "smooth" });
  };

  const prev = () => scrollToIndex(idx - 1);
  const next = () => scrollToIndex(idx + 1);

  const hasMulti = centers.length > 1;

  return (
    <div className="relative">
      {/* 트랙 */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className={[
          "no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto",
          "text- touch-pan-x overscroll-x-contain",
          className,
        ].join(" ")}
        style={{
          WebkitOverflowScrolling: "touch",
          paddingLeft: gutter,
          paddingRight: gutter,
        }}
      >
        {children}
      </div>

      {/* 좌/우 화살표 */}
      <div className="pointer-events-none absolute inset-y-0 right-0 left-0 flex items-center justify-between">
        <div
          className="pointer-events-auto"
          style={{ paddingLeft: arrowInset }}
        >
          <ArrowButton
            dir="left"
            onClick={prev}
            disabled={!hasMulti || idx <= 0}
          />
        </div>
        <div
          className="pointer-events-auto"
          style={{ paddingRight: arrowInset }}
        >
          <ArrowButton
            dir="right"
            onClick={next}
            disabled={!hasMulti || idx >= centers.length - 1}
          />
        </div>
      </div>
    </div>
  );
}
