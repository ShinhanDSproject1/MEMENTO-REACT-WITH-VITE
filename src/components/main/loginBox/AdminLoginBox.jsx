import PropTypes from "prop-types";
import kogiri from "@/assets/images/character-fox.svg";

function AdminLoginBox() {
  return (
    <div className="mx-auto w-full space-y-2 border-y border-[#76829718] bg-[#F0F4FA] pb-5 text-center">
      <div className="mb-4 flex items-center justify-center pt-4">
        <img src={kogiri} />
        <div className="font-WooridaumB pt-5 text-base font-bold">
          <span className="text-[#23272E] underline underline-offset-3">관리자</span>
          <span className="text-[#768297]">님 안녕하세요!</span>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginBox;

AdminLoginBox.propTypes = {
  userName: PropTypes.string,
};
