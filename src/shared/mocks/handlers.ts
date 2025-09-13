// src/shared/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  // ✅ 예약 가용시간 조회
  http.get("/api/reservation/availability/:mentosSeq", async ({ request, params }) => {
    const url = new URL(request.url);
    const selectedDate = url.searchParams.get("selectedDate");
    const mentosSeq = params.mentosSeq as string;

    console.log("[MSW] 예약 가용시간 요청", { mentosSeq, selectedDate });

    // 날짜별 가짜 데이터 (테스트용)
    const result =
      selectedDate === "2025-09-12" ? ["18:00", "19:00", "20:00"] : ["16:00", "17:00", "18:00"];

    return HttpResponse.json({
      code: 1000,
      status: 200,
      message: "Mocked availability",
      result,
    });
  }),

  // ✅ 결제 init (프론트가 기대하는 응답 구조 스텁)
  http.post("/api/mentos/payments/:memberSeq/init", async ({ request, params }) => {
    const body = (await request.json()) as {
      mentosSeq: number;
      mentosAt: string;
      mentosTime: string;
    };
    const memberSeq = params.memberSeq;

    console.log("[MSW] 결제 init 요청", { memberSeq, ...body });

    return HttpResponse.json({
      code: 1000,
      status: 200,
      message: "Mocked payment init",
      result: {
        orderId: `ORD_M_${body.mentosSeq}_${body.mentosAt}_${body.mentosTime.replace(":", "")}_TEST`,
        orderName: "모의 멘토링",
        amount: 50000,
        successUrl: "http://localhost:3000/booking/success",
        failUrl: "http://localhost:3000/booking/fail",
      },
    });
  }),
];
