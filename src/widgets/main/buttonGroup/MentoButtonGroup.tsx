import { useNavigate } from "react-router-dom";
import { MainButton } from "./MainButton";

function MentoButtonGroup() {
  const navigate = useNavigate();
  const style =
    "font-WooridaumB w-[300px] max-w-sm rounded-lg bg-[#005EF9] px-6 py-3 text-center font-bold text-white";
  return (
    <div className="mt-10 flex flex-col items-center gap-y-4">
      <MainButton
        className={style}
        onClick={() => {
          navigate("/create-mentos");
        }}>
        멘토링 생성하기
      </MainButton>
      <MainButton className={style} onClick={() => navigate("/mento/my-list")}>
        멘토링 관리하기
      </MainButton>
      <MainButton className={style} onClick={() => navigate("/chat")}>
        멘티와 채팅하기
      </MainButton>
      <MainButton
        className={style}
        onClick={() => {
          navigate("/reviews");
        }}>
        리뷰 확인하기
      </MainButton>
    </div>
  );
}
export default MentoButtonGroup;
