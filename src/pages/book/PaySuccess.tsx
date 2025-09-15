// src/pages/booking/PaySuccess.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { MODAL_CONFIG } from "@/utils/modal-config";
import { useEffect, useMemo, useRef, useState } from "react";
import { CommonModal } from "@/components/common/CommonModal";
import { confirmPaymentSuccess } from "@/shared/api/payments";

const weekdayKo = ["일", "월", "화", "수", "목", "금", "토"];
const formatKoreanDate = (ymd?: string, time?: string) => {
  if (!ymd) return "-";
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${m}.${d}(${weekdayKo[dt.getDay()]}) ${time ?? ""}`;
};

type PaymentState = {
  // 결제 전 단계에서 넘겼던 값들(예약/결제 페이지에서 state로 전달)
  mentosSeq: number;
  memberSeq: number;
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  amount?: number;
};

export default function PaySuccess() {
  const { search, state } = useLocation() as { search: string; state: Partial<PaymentState> };
  const navigate = useNavigate();
  const params = new URLSearchParams(search);

  // 쿼리에도 amount가 들어오면 보조로 사용
  const amount = Number(state?.amount ?? params.get("amount") ?? 0);
  const title = state?.title ?? "멘토링";
  const when = useMemo(
    () => formatKoreanDate(state?.date, state?.time),
    [state?.date, state?.time],
  );

  // 모달 메시지 구성
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
  const [pending, setPending] = useState(true);
  const roomIdRef = useRef<number | string | null>(null);

  // ✅ 성공 페이지 진입 시 백엔드 결제성공 처리 호출(채팅방 생성)
  useEffect(() => {
    // 필수 값 점검
    if (!state?.mentosSeq || !state?.memberSeq || !state?.date || !state?.time) {
      // 필수 파라미터 없으면 안전하게 마이 페이지로 복귀
      setPending(false);
      return;
    }

    (async () => {
      try {
        setPending(true);
        const res = await confirmPaymentSuccess(state.memberSeq, {
          mentosSeq: state.mentosSeq!,
          mentosAt: state.date!, // 명세서의 필드명 mentosAt
          mentosTime: state.time!, // 명세서의 필드명 mentosTime
        });

        // 응답에서 채팅방 아이디 추출(키 이름 다양성 대응)
        const id =
          res.data?.result?.chatRoomId ??
          res.data?.result?.roomId ??
          res.data?.result?.chatRoomSeq ??
          null;

        roomIdRef.current = id ?? null;
      } catch (e) {
        // 실패해도 모달은 그대로 띄우고, 확인 시 마이멘토스로 이동하도록 둠
        roomIdRef.current = null;
      } finally {
        setPending(false);
      }
    })();
  }, [state?.mentosSeq, state?.memberSeq, state?.date, state?.time]);

  const goNext = () => {
    setOpen(false);
    const id = roomIdRef.current;
    if (id) {
      navigate(`/chat/${id}`, { replace: true });
    } else {
      // 방 ID가 없으면 목록으로
      navigate("/mentee/mymentos", { replace: true, state: { fromPaymentSuccess: true } });
    }
  };

  return (
    <CommonModal
      type="paySuccess"
      isOpen={open}
      onConfirm={goNext}
      onCancel={goNext}
      // 로딩 표시를 모달 내부에 보여주고 싶다면 컴포넌트에 prop을 추가해 전달
      confirmDisabled={pending}
    />
  );
}
