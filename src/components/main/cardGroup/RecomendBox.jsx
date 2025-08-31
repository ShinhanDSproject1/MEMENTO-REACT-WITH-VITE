import PropTypes from "prop-types";
import NeedRecommend from "./NeedRecommend";
import RecommendCard from "./RecommendCard";

function RecomendBox({ userType, recommend }) {
  if (userType !== "mentee") return null;
  return <div>{recommend ? <RecommendCard /> : <NeedRecommend />}</div>;
}

export default RecomendBox;

RecomendBox.propTypes = {
  userType: PropTypes.string,
  recommend: PropTypes.bool,
};
