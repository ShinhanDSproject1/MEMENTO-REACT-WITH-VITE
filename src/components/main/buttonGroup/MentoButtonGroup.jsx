import { useNavigate } from "react-router-dom";
import { MainButton } from "./MainButton";

function MentoButtonGroup() {
  const navigate = useNavigate();
  const style =
    "font-WooridaumB w-[300px] max-w-sm rounded-lg bg-[#005EF9] px-6 py-3 text-center font-bold text-white";
  return (
    <div className="mt-10 flex flex-col items-center gap-y-4">
      <MainButton className={style}>멘토링 생성하기</MainButton>
      <MainButton className={style} onClick={() => navigate("/mento/my-list")}>
        멘토링 관리
      </MainButton>
      <MainButton className={style}>멘티 관리</MainButton>
      <MainButton className={style}>리뷰 확인하기</MainButton>
    </div>
  );
}
export default MentoButtonGroup;
