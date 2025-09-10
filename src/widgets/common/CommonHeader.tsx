import backIcon from "@assets/icons/icon-back.png";
import loginIcon from "@assets/icons/icon-login.svg";
import homeIcon from "@assets/icons/icon-move-home.svg";
import { useNavigate } from "react-router-dom";

interface CommonHeaderProps {
  onClickLogin?: () => void;
  onClickHome?: () => void;
}

export default function CommonHeader({
  onClickLogin,
  onClickHome,
}: CommonHeaderProps) {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  const goLogin = () => (onClickLogin ? onClickLogin() : navigate("/login"));
  const goHome = () => (onClickHome ? onClickHome() : navigate("/"));

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-3">
      {/* 왼쪽 뒤로가기 아이콘 */}
      <button type="button" onClick={goBack} aria-label="back">
        <img
          src={backIcon}
          alt="backIcon"
          className="mx-0 h-6 w-auto cursor-pointer hover:brightness-60"
        />
      </button>

      {/* 오른쪽 아이콘들 */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={goLogin} aria-label="login">
          <img
            src={loginIcon}
            alt="loginIcon"
            className="h-auto w-6 cursor-pointer transition duration-200 hover:brightness-60"
          />
        </button>
        <button type="button" onClick={goHome} aria-label="go home">
          <img
            src={homeIcon}
            alt="homeIcon"
            className="h-auto w-6 cursor-pointer transition duration-200 hover:brightness-60"
          />
        </button>
      </div>
    </header>
  );
}
