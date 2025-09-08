import loginIcon from "@/assets/images/login-icon.svg";
import homeIcon from "@/assets/images/move-home-icon.svg";
import backIcon from "@/assets/icons/backIcon.png";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";

export default function CommonHeader({ onClickLogin, onClickHome }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const isMyMentos = location.pathname.startsWith("/mentee/mymentos");
    const fromPaySuccess = location.state?.fromPaymentSuccess;

    if (isMyMentos && fromPaySuccess) {
      // 결제 완료 → 나의 멘토스 내역에서만 홈으로
      navigate("/", { replace: true, state: null });
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-3">
      {/* 왼쪽 뒤로가기 */}
      <button type="button" onClick={handleBack} aria-label="go back">
        <img
          src={backIcon}
          alt="backIcon"
          className="mx-0 h-6 w-auto cursor-pointer hover:brightness-60"
        />
      </button>

      {/* 오른쪽 아이콘들 */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={onClickLogin} aria-label="login">
          <img
            src={loginIcon}
            alt="loginIcon"
            className="h-auto w-6 cursor-pointer transition duration-200 hover:brightness-60"
          />
        </button>
        <button type="button" onClick={onClickHome} aria-label="go home">
          <img
            src={homeIcon}
            alt="homeIcon"
            className="h-auto w-6 cursor-pointer transition duration-200 hover:brightness-60"
            onClick={() => navigate("/")}
          />
        </button>
      </div>
    </header>
  );
}

CommonHeader.propTypes = {
  onClickLogin: PropTypes.func,
  onClickHome: PropTypes.func,
};
