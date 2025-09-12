// src/components/GuestLoginBox.tsx
import { useNavigate } from "react-router-dom";

export default function GuestLoginBox() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full space-y-2 border-y border-[#76829718] bg-[#F0F4FA] pb-5 text-center">
      <p className="font-WooridaumR mb-4 pt-4 text-sm text-slate-500">
        회원가입하시면 더 많은 서비스를 이용할 수 있어요!
      </p>

      <button
        type="button"
        className="mx-auto cursor-pointer rounded-full bg-[#AEC8EF] p-2 px-6 text-sm text-white hover:bg-[#657fa79d] hover:shadow"
        onClick={() => navigate("/login")}>
        로그인
      </button>
    </div>
  );
}
