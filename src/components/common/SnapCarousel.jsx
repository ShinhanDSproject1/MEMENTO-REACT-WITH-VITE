// components/ui/SnapCarousel.jsx
import { useRef, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

function ArrowButton({ dir = "left", onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "이전" : "다음"}
      className={[
        "grid h-9 w-9 place-items-center rounded-full border border-slate-300 bg-white/80 shadow-sm backdrop-blur",
        "hover:bg-white disabled:cursor-not-allowed disabled:opacity-40",
      ].join(" ")}>
      <span className="text-slate-600 select-none">{dir === "left" ? "‹" : "›"}</span>
    </button>
  );
}

ArrowButton.propTypes = {
  dir: PropTypes.oneOf(["left", "right"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default function SnapCarousel({ children, className = "", arrowInset = 8, arrowSize = 36 }) {
  const trackRef = useRef(null);
  const [centers, setCenters] = useState([]); // 각 카드의 "중심에 오도록" 해야 하는 scrollLeft
  const [idx, setIdx] = useState(0);

  const gutter = arrowInset + arrowSize; // 화살표 영역만큼 좌/우 패딩

  // .snap-item가 있으면 그것들, 없으면 직계 자식들 사용
  const getNodes = (el) => {
    const a = Array.from(el.querySelectorAll(".snap-item"));
    return a.length ? a : Array.from(el.children);
  };

  // 각 카드의 "중심 스크롤 위치" 계산
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
    // scrollLeft를 "카드 중심이 뷰 중앙(화살표 사이)으로 오게" 만드는 값
    const c = nodes.map((n) => {
      const left = n.offsetLeft;
      const w = n.offsetWidth;
      // 화살표 여백을 고려한 중앙 위치
      const centerLeft = left - (viewW - w) / 2 + (paddingLeft - gutter / 2);
      return Math.max(0, centerLeft);
    });
    setCenters(c);

    // 현재 스크롤에서 가장 가까운 카드 인덱스
    const cur = el.scrollLeft;
    let nearest = 0,
      best = Infinity;
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
    let ro, mo;
    measure();

    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(() => measure());
      trackRef.current && ro.observe(trackRef.current);
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
      ro?.disconnect?.();
      mo?.disconnect?.();
    };
  }, [measure]);

  // 스크롤 중에도 중앙과 가장 가까운 카드 추적
  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || centers.length === 0) return;
    const cur = el.scrollLeft;
    let nearest = 0,
      best = Infinity;
    centers.forEach((x, i) => {
      const d = Math.abs(cur - x);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setIdx(nearest);
  }, [centers]);

  const scrollToIndex = (i) => {
    const el = trackRef.current;
    if (!el || i < 0 || i >= centers.length) return;
    el.scrollTo({ left: centers[i], behavior: "smooth" });
  };
  const prev = () => scrollToIndex(idx - 1);
  const next = () => scrollToIndex(idx + 1);

  const hasMulti = centers.length > 1;

  return (
    <div className="relative">
      {/* 트랙: 중앙 스냅 + 드래그 */}
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
          // 화살표가 가리는 걸 방지하려고 좌우 패딩을 부여
          paddingLeft: gutter,
          paddingRight: gutter,
        }}>
        {children}
      </div>

      {/* 좌/우 화살표: 컨테이너 안으로 조금 들어오게 배치 */}
      <div className="pointer-events-none absolute inset-y-0 right-0 left-0 flex items-center justify-between">
        <div className="pointer-events-auto" style={{ paddingLeft: arrowInset }}>
          <ArrowButton dir="left" onClick={prev} disabled={!hasMulti || idx <= 0} />
        </div>
        <div className="pointer-events-auto" style={{ paddingRight: arrowInset }}>
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

SnapCarousel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  arrowInset: PropTypes.number, // 화살표가 안쪽으로 들어오는 여백(px)
  arrowSize: PropTypes.number, // 화살표 버튼 가로폭(px)
};
