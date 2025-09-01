import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function MenteeLoginBox({ userName }) {
  const navigate = useNavigate();
  return (
    <div className="mx-auto w-full space-y-2 bg-[#F0F4FA] pb-3 text-center">
      <div className="mb-4 flex items-center justify-center gap-3 pt-4">
        <div className="font-[WooridaumB] text-base font-bold">
          <span className="text-[#23272E] underline">{userName}</span>
          <span className="text-[#768297]"> 멘티님 안녕하세요!</span>
        </div>
      </div>

      <button
        className="mx-auto cursor-pointer rounded-full bg-[#005EF9] p-2 px-6 text-sm font-semibold text-white hover:bg-[#0C2D62] hover:shadow"
        onClick={() => navigate("/mentee/mymentos")}>
        나의 멘토링내역
      </button>
      <button
        className="mx-auto ml-5 cursor-pointer rounded-full bg-[#005EF9] p-2 px-6 text-sm font-semibold text-white hover:bg-[#0C2D62] hover:shadow"
        onClick={() => navigate("/myprofile")}>
        나의 정보관리
      </button>
    </div>
  );
}

export default MenteeLoginBox;

MenteeLoginBox.propTypes = {
  userName: PropTypes.string,
};
