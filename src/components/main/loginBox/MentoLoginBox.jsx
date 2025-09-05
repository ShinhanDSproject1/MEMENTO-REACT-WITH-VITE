import PropTypes from "prop-types";
import kogiri from "@/assets/images/character-kogiri.svg";

import { useNavigate } from "react-router-dom";

function MentoLoginBox({ userName, userProfileImage }) {
  const navigate = useNavigate();

  // const profileImg = userProfileImage || kogiri;
  return (
    <div className="mx-auto w-full space-y-2 border-y border-[#76829718] bg-[#F0F4FA] pb-5 text-center">
      <div className="mb-4 flex items-center justify-center gap-3 pt-4">
        <img src={kogiri} />
        {/* <img
          src={profileImg}
          alt={`${userName} 프로필`}
          className="h-10 w-10 rounded-full border-2 border-gray-300 bg-white object-cover"
        /> */}
        <div className="font-WooridaumB text-base font-bold">
          <span className="text-[#23272E] underline underline-offset-3">{userName}</span>
          <span className="text-[#768297]"> 멘토님 안녕하세요!</span>
        </div>
      </div>

      <button
        className="mx-auto cursor-pointer rounded-full bg-[#005EF9] p-2 px-6 text-sm font-semibold text-white hover:bg-[#0C2D62] hover:shadow"
        onClick={() => navigate("/mento")}>
        내 정보수정
      </button>
    </div>
  );
}

export default MentoLoginBox;

MentoLoginBox.propTypes = {
  userName: PropTypes.string,
  userProfileImage: PropTypes.string,
};
