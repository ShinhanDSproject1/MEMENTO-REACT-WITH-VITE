import AdminLoginBox from "./AdminLoginBox";
import GuestLoginBox from "./GuestLoginBox";
import MenteeLoginBox from "./MenteeLoginBox";
import MentoLoginBox from "./MentoLoginBox";
import PropTypes from "prop-types";

function LoginBox({ userType, userName, userProfileImage }) {
  if (userType === "mentee") {
    return <MenteeLoginBox userName={userName} />;
  } else if (userType === "mentor") {
    return <MentoLoginBox userName={userName} userProfileImage={userProfileImage} />;
  } else if (userType === "admin") {
    return <AdminLoginBox />;
  } else {
    return <GuestLoginBox />;
  }
}

export default LoginBox;

LoginBox.propTypes = {
  userType: PropTypes.string,
  userName: PropTypes.string,
  userProfileImage: PropTypes.string,
};
