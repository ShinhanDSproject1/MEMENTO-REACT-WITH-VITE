// components/RecommendationCTA.jsx
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function NeedRecommend({
  title = "추천 멘토링 클래스",
  label = "멘토링 클래스 추천받기",
  disabled = false,
}) {
  const navigate = useNavigate();
  return (
    <section className="relative mx-auto mt-10 w-85 rounded-[28px] border border-slate-200 bg-white px-6 py-6">
      <h3 className="[font-WooridaumB] text-center text-base font-extrabold text-slate-500 underline underline-offset-4">
        {title}
      </h3>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={navigate("")}
          disabled={disabled}
          className={[
            "min-w-[260px] rounded-full px-8 py-3 text-sm font-extrabold transition-all",
            disabled
              ? "cursor-not-allowed bg-slate-200 text-slate-500"
              : "bg-slate-200 text-slate-600 hover:bg-slate-300 active:scale-[0.99]",
            // 그림자 살짝
            "shadow-[0_2px_10px_rgba(0,0,0,0.04)]",
          ].join(" ")}>
          {label}
        </button>
      </div>
    </section>
  );
}

NeedRecommend.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};
