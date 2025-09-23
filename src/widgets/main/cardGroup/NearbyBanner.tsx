// src/widgets/main/cardGroup/NearbyBanner.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface NearbyBannerProps {
  userType?: "mentee" | "mentor" | "admin" | "guest";
  onClick?: () => void;
}

export default function NearbyBanner({ userType = "guest", onClick }: NearbyBannerProps) {
  const navigate = useNavigate();

  if (userType !== "mentee") return null;

  const handleClick = () => (onClick ? onClick() : navigate("/mento/nearby"));

  return (
    <section
      className="mx-4 mb-4 overflow-hidden rounded-xl bg-[linear-gradient(90deg,#F6FAFF_0%,#EFF5FF_100%)] ring-1 ring-slate-200"
      aria-label="내 주변 멘토 찾기">
      <div className="flex items-center justify-between px-4 py-3">
        {/* 텍스트 */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">내 주변 멘토 빠르게 보기</p>
          <p className="truncate text-xs text-slate-500">가까운 거리의 멘토를 만나보세요!</p>
        </div>

        {/* CTA 칩 */}
        <button
          type="button"
          onClick={handleClick}
          className="ml-3 shrink-0 rounded-full border border-[#1161FF] bg-[#1161FF] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white hover:text-[#1161FF]">
          바로가기
        </button>
      </div>
    </section>
  );
}
