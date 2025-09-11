import { useLocation, useNavigate } from "react-router-dom";
import { MODAL_CONFIG } from "@/utils/modal-config";
import { useMemo, useState } from "react";
import { CommonModal } from "@/components/common/CommonModal";

const weekdayKo = ["일", "월", "화", "수", "목", "금", "토"];
const formatKoreanDate = (ymd?: string, time?: string) => {
  if (!ymd) return "-";
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${m}.${d}(${weekdayKo[dt.getDay()]}) ${time ?? ""}`;
};

export default function PaySuccess() {
  const { search, state } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);

  const amount = Number(params.get("amount") || 0);
  const title = state?.title ?? "멘토링";
  const when = useMemo(
    () => formatKoreanDate(state?.date, state?.time),
    [state?.date, state?.time],
  );
  const line = `${title} · ${when} · ${amount.toLocaleString()}원 결제 완료!`;
  MODAL_CONFIG.paySuccess.message = (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="font-WooridaumB text-lg">결제 완료</p>
      <div className="w-full max-w-xs rounded-lg border border-gray-200 bg-gray-50 p-3">
        <p className="font-WooridaumB text-lg text-[#222939]">{title}</p>
        <p className="font-WooridaumR text-sm text-[#287EFF]">{when}</p>
        <p className="font-WooridaumR text-sm">{amount.toLocaleString()}원</p>
      </div>
    </div>
  );

  const [open, setOpen] = useState(true);
  const goMyMentos = () => {
    setOpen(false);
    navigate("/mentee/mymentos", { replace: true, state: { fromPaymentSuccess: true } });
  };

  return (
    <CommonModal type="paySuccess" isOpen={open} onConfirm={goMyMentos} onCancel={goMyMentos} />
  );
}
