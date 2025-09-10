import { http, HttpResponse } from "msw";

export const handlers = [
  // 결제 초기화: BE가 줄 값 그대로 흉내
  http.post("/mentos/payments/:reservationSeq", async ({ params }) => {
    const reservationSeq = String(params.reservationSeq);
    return HttpResponse.json({
      data: {
        amount: 50000,
        orderId: `MEMENTO-${reservationSeq}-${Date.now()}`,
        orderName: "인생 한방, 공격투자 멘토링",
        successUrl: `${location.origin}/memento-finance/pay/success`,
        failUrl: `${location.origin}/memento-finance/pay/fail`,
      },
    });
  }),
];
