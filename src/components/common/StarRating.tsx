// src/components/StarRating.tsx
import { useState } from "react";

type StarIconProps = {
  colorClass: string;
};

const StarIcon = ({ colorClass }: StarIconProps) => (
  <svg
    className={`h-8 w-8 ${colorClass}`}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 22 20"
  >
    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
  </svg>
);

export type StarRatingProps = {
  /** 별점이 바뀔 때 호출 (1~5) */
  onRatingChange?: (value: number) => void;
  /** 초기 별점 (기본값 3) */
  initialRating?: number;
  /** 총 별 개수 (기본값 5) */
  totalStars?: number;
};

export function StarRating({
  onRatingChange,
  initialRating = 3,
  totalStars = 5,
}: StarRatingProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleClick = (starValue: number) => {
    setRating(starValue);
    onRatingChange?.(starValue);
  };

  const handleMouseEnter = (starValue: number) => {
    setHoverRating(starValue);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div
      className="my-3 flex items-center justify-around"
      role="radiogroup"
      aria-label="별점"
    >
      {Array.from({ length: totalStars }, (_, index) => {
        const starValue = index + 1;
        const active = starValue <= (hoverRating || rating);
        const colorClass = active
          ? "text-yellow-300"
          : "text-gray-300 dark:text-gray-500";

        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={rating === starValue}
            aria-label={`${starValue}점`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            className="cursor-pointer"
          >
            <StarIcon colorClass={colorClass} />
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;
