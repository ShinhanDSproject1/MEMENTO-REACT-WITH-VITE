import PropTypes from "prop-types";
import StarStatic from "@/components/profile/StarStatic.jsx";

export default function ReviewCard({ title, date, rating, name, content, className = "" }) {
  return (
    <article
      role="article"
      aria-label="리뷰"
      className={`w-full rounded-[12px] border border-[#E5E7ED] bg-white p-4 shadow-[0_2px_10px_rgba(11,15,25,0.06)] ${className}`}>
      <h3 className="text-[15px] font-extrabold text-[#111827]">{title}</h3>
      <p className="mt-1 text-xs text-[#6B7280]">{date}</p>
      <StarStatic value={rating} className="mt-2" />
      <p className="mt-1 text-sm font-semibold text-[#1F2937]">{name}</p>
      <p className="mt-1 text-sm leading-6 whitespace-pre-wrap text-[#6B7280]">{content}</p>
    </article>
  );
}
ReviewCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  className: PropTypes.string,
  full: PropTypes.bool,
};
