import { useNavigate } from "react-router-dom";
import { MainButton } from "./MainButton";

function AdminButtonGroup() {
  const navigate = useNavigate();
  const style =
    "font-WooridaumB w-[300px] max-w-sm rounded-lg bg-[#005EF9] px-6 py-3 text-center font-bold text-white";
  return (
    <div className="mt-10 flex flex-col items-center gap-y-4">
      <MainButton className={style} onClick={() => navigate("/admin/report")}>
        회원관리
      </MainButton>
      <MainButton
        className={style}
        onClick={() => navigate("/admin/declaration")}
      >
        관리자 신고확인
      </MainButton>
      <MainButton className={style} onClick={() => navigate("/admin/revenue")}>
        수익관리
      </MainButton>
    </div>
  );
}

export default AdminButtonGroup;
