// src/components/review/ReviewCard.tsx
import StarStatic from "@/components/profile/StarStatic";

export interface ReviewCardProps {
  title: string;
  date: string;
  rating: number;
  name: string;
  content: string;
  className?: string;
  full?: boolean;
}

export default function ReviewCard({
  title,
  date,
  rating,
  name,
  content,
  className = "",
}: ReviewCardProps) {
  return (
    <article
      role="article"
      aria-label="리뷰"
      className={`w-full rounded-[12px] border border-[#E5E7ED] bg-white p-4 shadow-[0_2px_10px_rgba(11,15,25,0.06)] ${className}`}
    >
      <h3 className="text-[15px] font-extrabold text-[#111827]">{title}</h3>
      <p className="mt-1 text-xs text-[#6B7280]">{date}</p>
      <StarStatic value={rating} className="mt-2" />
      <p className="mt-1 text-sm font-semibold text-[#1F2937]">{name}</p>
      <p className="mt-1 text-sm leading-6 whitespace-pre-wrap text-[#6B7280]">
        {content}
      </p>
    </article>
  );
}
