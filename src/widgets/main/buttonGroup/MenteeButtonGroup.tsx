import { useNavigate } from "react-router-dom";
import { MainButton } from "./MainButton";

function MenteeButtonGroup() {
  const navigate = useNavigate();
  const style =
    "font-WooridaumB w-[300px] max-w-sm rounded-lg bg-[#005EF9] px-6 py-3 text-center font-bold text-white";
  return (
    <div className="mt-10 flex flex-col items-center gap-y-4">
      <MainButton className={style} onClick={() => navigate("/mentee/consumption")}>
        소비 패턴
      </MainButton>
      <MainButton className={style} onClick={() => navigate("/mentee/tips")}>
        생활 노하우
      </MainButton>
      <MainButton className={style} onClick={() => navigate("/mentee/saving")}>
        저축 방식
      </MainButton>
      <MainButton className={style} onClick={() => navigate("/mentee/growth")}>
        자산 증식
      </MainButton>
    </div>
  );
}

export default MenteeButtonGroup;
