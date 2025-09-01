// src/components/StarRating.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";

const StarIcon = ({ colorClass }) => (
  <svg
    className={`h-8 w-8 ${colorClass}`}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 22 20">
    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
  </svg>
);

StarIcon.propTypes = {
  colorClass: PropTypes.string.isRequired,
};

export function StarRating({ onRatingChange }) {
  const [rating, setRating] = useState(3);
  const [hoverRating, setHoverRating] = useState(0);
  const totalStars = 5;

  const handleClick = (starValue) => {
    setRating(starValue);
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleMouseEnter = (starValue) => {
    setHoverRating(starValue);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="my-3 flex items-center justify-around">
      {Array.from({ length: totalStars }, (_, index) => {
        const starValue = index + 1;
        const colorClass =
          starValue <= (hoverRating || rating)
            ? "text-yellow-300"
            : "text-gray-300 dark:text-gray-500";

        return (
          <div
            key={starValue}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            className="cursor-pointer">
            <StarIcon colorClass={colorClass} />
          </div>
        );
      })}
    </div>
  );
}

StarRating.propTypes = {
  onRatingChange: PropTypes.func,
};
