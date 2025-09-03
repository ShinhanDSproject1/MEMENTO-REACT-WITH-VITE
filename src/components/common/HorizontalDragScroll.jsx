// src/components/common/HorizontalDragScroll.jsx
import { useRef, useState } from "react";

export default function HorizontalDragScroll({ className = "", children }) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);
  const state = useRef({
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  const onPointerDown = (e) => {
    const el = ref.current;
    if (!el) return;
    // 텍스트/이미지 선택, 이미지 드래그 방지
    e.preventDefault();
    el.setPointerCapture?.(e.pointerId);
    setDragging(true);
    state.current.startX = e.clientX;
    state.current.startScroll = el.scrollLeft;
    state.current.moved = false;
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const el = ref.current;
    if (!el) return;
    const dx = e.clientX - state.current.startX;
    if (Math.abs(dx) > 2) state.current.moved = true;
    el.scrollLeft = state.current.startScroll - dx;
  };

  const endDrag = (e) => {
    const el = ref.current;
    setDragging(false);
    el?.releasePointerCapture?.(e.pointerId);
  };

  // 드래그 중 클릭이 전파되어 카드 클릭이 눌리는 것 방지
  const onClickCapture = (e) => {
    if (state.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      state.current.moved = false;
    }
  };

  return (
    <div
      ref={ref}
      className={[
        // 스크롤/레이아웃
        "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto",
        // 터치 제스처 허용
        "touch-pan-x overscroll-x-contain",
        // UX 피드백
        dragging ? "cursor-grabbing select-none" : "cursor-grab",
        "drag-scroll",
        className,
      ].join(" ")}
      style={{ WebkitOverflowScrolling: "touch" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={onClickCapture}>
      {children}
    </div>
  );
}
