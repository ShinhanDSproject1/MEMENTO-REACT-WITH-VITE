import PropTypes from "prop-types";

function AdminLoginBox() {
  return (
    <div className="mx-auto w-full space-y-2 bg-[#F0F4FA] pb-5 text-center">
      <div className="font-WooridaumB pt-5 text-base font-bold">
        <span className="text-[#23272E] underline">관리자</span>
        <span className="text-[#768297]">님 안녕하세요!</span>
      </div>
    </div>
  );
}

export default AdminLoginBox;

AdminLoginBox.propTypes = {
  userName: PropTypes.string,
};
