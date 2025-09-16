// src/shared/api/payments.ts
import { http } from "@api/https";

export async function initMentosPayment(payload: {
  mentosSeq: number;
  mentosAt: string; // "YYYY-MM-DD"
  mentosTime: string; // "HH:mm"
}) {
  const { data } = await http.post("/mentos/payments/init", payload, {
    headers: { "Content-Type": "application/json" },
  });
  const r = (data?.result ?? data) as any;
  return {
    orderId: String(r.orderId ?? ""),
    amount: Number(r.amount ?? 0),
    successUrl: r.successUrl ?? r.success, // 서버 키 변동 대비
    failUrl: r.failUrl ?? r.fail,
  };
}
