import PropTypes from "prop-types";
import MentoButtonGroup from "./MentoButtonGroup";
import MenteeButtonGroup from "./MenteeButtonGroup";
import AdminButtonGroup from "./AdminButtonGroup";

export default function ButtonGroup({ userType }) {
  if (userType === "mentor") {
    return <MentoButtonGroup />;
  } else if (userType === "mentee") {
    return <MenteeButtonGroup />;
  } else if (userType === "admin") {
    return <AdminButtonGroup />;
  } else {
    <MenteeButtonGroup />;
  }
}

ButtonGroup.propTypes = {
  userType: PropTypes.string,
};
