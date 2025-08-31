import logo from "@/assets/images/memento-logo.svg";
import loginIcon from "@/assets/images/login-icon.svg";
import homeIcon from "@/assets/images/move-home-icon.svg";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function MainHeader({ onClickLogin, onClickHome }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-3 sm:px-6 lg:px-8">
      {/* 왼쪽 로고 */}
      <img
        src={logo}
        alt="memento logo"
        className="h-auto w-[120px] cursor-pointer hover:brightness-60 sm:w-[140px] lg:w-[160px]"
      />

      {/* 오른쪽 아이콘들 */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={onClickLogin} aria-label="login">
          <img
            src={loginIcon}
            alt="lgoinIcon"
            className="h-auto w-6 cursor-pointer transition duration-200 hover:brightness-60"
            onClick={() => navigate("/login")}
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

MainHeader.propTypes = {
  onClickLogin: PropTypes.func,
  onClickHome: PropTypes.func,
};
