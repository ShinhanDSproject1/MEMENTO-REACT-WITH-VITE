// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

async function parseJsonSafe(request: Request) {
  const ct = request.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export const handlers = [
  // 예약 생성 POST /api/reservation
  http.post("/reservation", async ({ request }) => {
    const body = (await parseJsonSafe(request)) as {
      mentosSeq: number;
      mentosDate: string;
      mentosTime: string;
    } | null;
    if (!body)
      return HttpResponse.json(
        { code: 4000, status: 400, message: "잘못된 요청 바디입니다." },
        { status: 400 },
      );

    return HttpResponse.json({
      code: 1000,
      status: 200,
      message: "정상적으로 예약되었습니다.",
      data: { reservationSeq: 1234, ...body },
    });
  }),

  // 결제 init POST /api/mentos/payments/{memberSeq}/init
  http.post("/mentos/payments/:memberSeq/init", async ({ params, request }) => {
    const { memberSeq } = params as { memberSeq: string };
    const body = await parseJsonSafe(request);
    if (!body)
      return HttpResponse.json(
        { code: 4000, status: 400, message: "잘못된 요청 바디입니다." },
        { status: 400 },
      );

    return HttpResponse.json({
      code: 1000,
      status: 200,
      message: "결제 준비가 완료되었습니다.",
      data: {
        amount: 50000,
        orderId: `MEMENTO-${memberSeq}-${Date.now()}`,
        orderName: "이성 생활, 공정투자 멘토링",
        successUrl: `${location.origin}/memento-finance/pay/success`,
        failUrl: `${location.origin}/memento-finance/pay/fail`,
      },
    });
  }),
];
