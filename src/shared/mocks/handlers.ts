import { http, HttpResponse } from "msw";

// 데모용 메모리 저장소(간단 홀드 효과)
const holds = new Map<string, { memberSeq?: number }>();

export const handlers = [
  // 1) 예약 생성: POST /api/reservation
  http.post("/api/reservation", async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as any;
    const { mentosSeq, mentosDate, mentosTime } = body || {};

    if (!mentosSeq || !mentosDate || !mentosTime) {
      return HttpResponse.json(
        { code: 1400, status: 400, message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    const key = `${mentosSeq}::${mentosDate}::${mentosTime}`;
    if (holds.has(key)) {
      return HttpResponse.json(
        { code: 1409, status: 409, message: "이미 예약된 시간입니다." },
        { status: 409 },
      );
    }

    holds.set(key, {}); // 홀드
    return HttpResponse.json({
      code: 1000,
      status: 200,
      message: "예약 생성 성공",
      data: { reservationSeq: Math.floor(Math.random() * 1_000_000) },
    });
  }),

  // 2) 가용 시간 조회: GET /api/reservation/availability/:mentosSeq?selectedDate=YYYY-MM-DD
  http.get("/api/reservation/availability/:mentosSeq", ({ params, request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get("selectedDate") || "";
    const mentosSeq = String(params.mentosSeq);

    // 데모용 슬롯
    let result = ["19:00", "20:00", "21:00"];

    // 이미 예약/홀드된 시간은 제거
    result = result.filter((t) => !holds.has(`${mentosSeq}::${date}::${t}`));

    return HttpResponse.json({
      code: 1000,
      status: 200,
      message: "OK",
      result, // fetchAvailability가 "HH:mm"로 사용
    });
  }),

  // 3) 결제 init: POST /api/mentos/payments/:memberSeq/init
  http.post("/api/mentos/payments/:memberSeq/init", async ({ params, request }) => {
    const body = (await request.json().catch(() => ({}))) as any;
    const { mentosSeq, mentosDate, mentosTime } = body || {};
    const memberSeq = Number(params.memberSeq);

    if (!mentosSeq || !mentosDate || !mentosTime) {
      return HttpResponse.json(
        { code: 1400, status: 400, message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    const key = `${mentosSeq}::${mentosDate}::${mentosTime}`;
    // 예약 단계에서 잡아둔 홀드를 확인(데모용 검증)
    if (!holds.has(key)) {
      return HttpResponse.json(
        { code: 1404, status: 404, message: "예약 내역을 찾을 수 없습니다." },
        { status: 404 },
      );
    }
    holds.set(key, { memberSeq });

    const origin = location.origin;
    return HttpResponse.json({
      code: 1000,
      status: 200,
      message: "결제 준비 완료",
      data: {
        amount: 50000,
        orderId: `MEMENTO-${Date.now()}`,
        orderName: "인생 역전, 공격투자 멘토링",
        successUrl: `${origin}/memento-finance/pay/success?orderId=MEMENTO-${Date.now()}`,
        failUrl: `${origin}/memento-finance/pay/fail`,
      },
    });
  }),
];
