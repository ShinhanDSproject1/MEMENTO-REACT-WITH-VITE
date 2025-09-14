// src/components/MainHeader.tsx
import loginIcon from "@assets/icons/icon-login.svg";
import homeIcon from "@assets/icons/icon-move-home.svg";
import logo from "@assets/images/logo/memento-logo.svg";
import { useAuth } from "@entities/auth";
import { useNavigate } from "react-router-dom";

export interface MainHeaderProps {
  onClickLogin?: () => void;
  onClickHome?: () => void;
}

export default function MainHeader({ onClickHome }: MainHeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const goLogin = async () => {
    if (user) {
      await logout();
      alert("로그아웃 되었습니다."); //임시 - 추후에 모달UI 추가 필요
      navigate("/");
    } else {
      navigate("/login");
    }
  };
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-3 sm:px-6 lg:px-8">
      {/* 왼쪽 로고 */}
      <img
        src={logo}
        alt="memento logo"
        className="h-auto w-[120px] cursor-pointer hover:brightness-60 sm:w-[140px] lg:w-[160px]"
        onClick={() => navigate("/")} // 로고 클릭 → 홈 이동
      />

      {/* 오른쪽 아이콘들 */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={goLogin} aria-label="login">
          <img
            src={loginIcon}
            alt="loginIcon"
            className="h-auto w-6 cursor-pointer transition duration-200 hover:brightness-60"
          />
        </button>
        <button type="button" onClick={onClickHome ?? (() => navigate("/"))} aria-label="go home">
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
