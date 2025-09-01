import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function SignupSelect() {
  const navigate = useNavigate();
  return (
    <main className="font-WooridaumB mx-auto w-full max-w-md py-20">
      <h1 className="mb-8 text-center text-2xl font-extrabold text-slate-900">
        가입하시려는 유형을 선택해주세요
      </h1>

      <div className="mt-20 space-y-10 pr-10">
        {/* 멘티 */}
        <button
          type="button"
          onClick={() => navigate("/signup/mentee")}
          className="group flex w-full items-center justify-between rounded-r-full bg-[#9BB9FF] px-6 py-6 text-left shadow-[0_10px_30px_rgba(155,185,255,0.35)] transition-transform hover:scale-[1.01] active:scale-[0.99]">
          <span className="text-xl font-extrabold text-white">멘티</span>
          <div className="h-20 w-20 rounded-full bg-white/95 shadow-[0_6px_16px_rgba(0,0,0,0.1)]">
            <img src="../src/assets/images/character-Gom.svg" className="h-20 w-20" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate("/signup/mentor")}
          className="group flex w-full items-center justify-between rounded-r-full bg-[#1161FF] px-6 py-6 text-left shadow-[0_12px_32px_rgba(17,97,255,0.35)] transition-transform hover:scale-[1.01] active:scale-[0.99]">
          <span className="text-xl font-extrabold text-white">멘토</span>
          <div className="h-20 w-20 rounded-full bg-white/95 shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
            <img src="../src/assets/images/character-kogiri.svg" className="h-20 w-20" />
          </div>
        </button>
      </div>
    </main>
  );
}

SignupSelect.propTypes = {
  onSelect: PropTypes.func, // (role) => void  // role: 'mentee' | 'mentor'
};
