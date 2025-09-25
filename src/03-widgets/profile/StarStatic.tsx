// src/components/profile/StarStatic.tsx

interface StarProps {
  active: boolean;
}

function Star({ active }: StarProps) {
  return (
    <svg
      className={`h-4 w-4 ${active ? "fill-yellow-400" : "fill-gray-300"}`}
      viewBox="0 0 22 20"
      aria-hidden="true">
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
    </svg>
  );
}

export interface StaticStarsProps {
  value?: number; // 현재 평점
  total?: number; // 전체 별 개수
  className?: string; // 추가 클래스
}

export default function StaticStars({ value = 0, total = 5, className = "" }: StaticStarsProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={`평점 ${value}점`}>
      {Array.from({ length: total }, (_, i) => (
        <Star key={i} active={i + 1 <= value} />
      ))}
    </div>
  );
}
