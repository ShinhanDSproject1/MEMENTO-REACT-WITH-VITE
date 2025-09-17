import { http } from "@api/https";
import { getAccessToken } from "@/shared/auth/token";

export async function initMentosPayment(body: {
  mentosSeq: number;
  mentosAt: string;
  mentosTime: string;
}) {
  const { data } = await http.post("/mentos/payments/init", body);
  return data?.result ?? data;
}

export async function confirmPayment(
  query: { orderId: string; paymentKey: string; amount: number },
  body: { mentosSeq: number; mentosAt: string; mentosTime: string },
) {
  const config = {
    params: {
      orderId: query.orderId,
      paymentKey: query.paymentKey,
      amount: query.amount,
    },
    headers: {
      Authorization: `Bearer ${getAccessToken?.() ?? ""}`,
    },
    withCredentials: true,
  } as const;

  const { data } = await http.post("/payments/success", body, config);
  return data;
}
