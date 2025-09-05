import PropTypes from "prop-types";
import StaticStars from "../profile/StarStatic";
import { useParams } from "react-router-dom";

function ReviewMentosDetailCard({ value, context, name, ...props }) {
  return (
    <div className="flex h-[100px] w-full max-w-[350px] flex-col gap-2 overflow-hidden rounded-[10px] border-[1px] border-[#E5E7ED] p-3">
      <div className="flex w-full">
        <StaticStars value={value} className="w-[80%]" />
      </div>
      <div>
        <p className="font-WooridaumR text-[0.65rem]">{context}</p>
      </div>
      <div className="flex justify-end">
        <span className="font-WooridaumR text-[0.5em]">{name}</span>
      </div>
    </div>
  );
}

ReviewMentosDetailCard.propTypes = {
  value: PropTypes.number,
  context: PropTypes.string,
  name: PropTypes.string,
};

export default ReviewMentosDetailCard;
