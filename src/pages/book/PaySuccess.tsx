import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CommonModal from "@/widgets/common/CommonModal";
import { MODAL_CONFIG } from "@/shared/ui/ModalConfig";
import { confirmPayment } from "@/shared/api/payments";
import { getAccessToken } from "@/shared/auth/token";

const weekdayKo = ["일", "월", "화", "수", "목", "금", "토"];
const fmt = (ymd?: string, time?: string) => {
  if (!ymd) return "-";
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${m}.${d}(${weekdayKo[dt.getDay()]}) ${time ?? ""}`;
};

const buildMessage = (title: string, when: string, amount: number) => (
  <div className="flex flex-col items-center gap-4 text-center">
    <p className="font-WooridaumB text-lg">결제 완료</p>
    <div className="w-full max-w-xs rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="font-WooridaumB text-lg text-[#222939]">{title}</p>
      <p className="font-WooridaumR text-sm text-[#287EFF]">{when}</p>
      <p className="font-WooridaumR text-sm">{amount.toLocaleString()}원</p>
    </div>
  </div>
);

export default function PaySuccess() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);

  const paymentKey = params.get("paymentKey") ?? "";
  const orderId = params.get("orderId") ?? "";
  const amountQ = Number(params.get("amount") ?? 0);

  const ctx = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("mentos.pay.ctx") || "{}");
    } catch {
      return {};
    }
  })();

  const title0 = (ctx.title as string) ?? "멘토링";
  const when0 = fmt(ctx.date as string | undefined, ctx.time as string | undefined);
  const amount0 = Number((ctx.price as number | undefined) ?? amountQ ?? 0);

  const [tick, setTick] = useState(0);
  const [open, setOpen] = useState(true);
  const [pending, setPending] = useState(true);

  const roomIdRef = useRef<number | string | null>(null);
  const successRef = useRef(false);
  const calledRef = useRef(false);

  useEffect(() => {
    MODAL_CONFIG.paySuccess.message = buildMessage(title0, when0, amount0);
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    (async () => {
      try {
        const mentosSeq = Number(ctx.mentosSeq ?? 0);
        const mentosAt = (ctx.date as string) ?? "";
        const mentosTime = (ctx.time as string) ?? "";

        const token = getAccessToken?.();
        if (
          !token ||
          !paymentKey ||
          !orderId ||
          !amountQ ||
          !mentosSeq ||
          !mentosAt ||
          !mentosTime
        ) {
          setPending(false);
          return;
        }

        setPending(true);

        const res = await confirmPayment(
          { orderId, paymentKey, amount: amountQ },
          { mentosSeq, mentosAt, mentosTime },
        );

        const r = res?.data?.result ?? res?.result ?? {};

        const title1 = (r.mentosTitle as string) ?? title0;
        const when1 = fmt(
          (r.mentosAt as string) ?? mentosAt,
          (r.mentosTime as string) ?? mentosTime,
        );
        const amount1 = Number((r.price as number | undefined) ?? amount0);

        MODAL_CONFIG.paySuccess.message = buildMessage(title1, when1, amount1);
        setTick((t) => t + 1);

        const id = r.chatRoomId ?? r.roomId ?? r.chatRoomSeq ?? null;
        roomIdRef.current = id ?? null;

        successRef.current = true;
      } catch (e) {
        console.error("[PaySuccess] confirmPayment failed:", e);
        roomIdRef.current = null;
      } finally {
        setPending(false);
        if (successRef.current) {
          sessionStorage.removeItem("mentos.pay.ctx");
        }
      }
    })();
  }, [paymentKey, orderId, amountQ]);

  const goNext = () => {
    setOpen(false);
    const id = roomIdRef.current;
    if (id) navigate(`/chat/${id}`, { replace: true });
    else navigate("/menti/mymentos", { replace: true, state: { fromPaymentSuccess: true } });
  };

  return (
    <CommonModal
      key={tick}
      type="paySuccess"
      isOpen={open}
      onConfirm={goNext}
      onCancel={goNext}
      confirmDisabled={pending}
    />
  );
}
