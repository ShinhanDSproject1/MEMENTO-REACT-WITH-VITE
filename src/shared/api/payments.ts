// src/shared/api/payments.ts
import { axiosAuth } from "./axiosAuth";

// ---------- 결제 Init (이미 있는 함수) ----------
export type InitPaymentReq = {
  mentosSeq: number;
  mentosDate: string; // "YYYY-MM-DD"
  mentosTime: string; // "HH:mm"
};

export type InitPaymentRes = {
  code: number;
  status: number;
  message: string;
  data: {
    amount: number;
    orderId: string;
    orderName: string;
    successUrl: string;
    failUrl: string;
  };
};

// POST /api/mentos/payments/{memberSeq}/init
export async function initMentosPayment(memberSeq: number, body: InitPaymentReq) {
  return axiosAuth<InitPaymentRes>({
    url: `/mentos/payments/${memberSeq}/init`,
    method: "POST",
    data: body,
  });
}

// ---------- 결제 성공 처리 (채팅방 생성) ----------
/**
 * 명세서: POST /api/payments/success/{memberSeq}/init
 * Request Body:
 * {
 *   "mentosSeq": 1,
 *   "mentosAt": "2025-09-08",   // 날짜 (YYYY-MM-DD)
 *   "mentosTime": "12:00"       // 시간 (HH:mm)
 * }
 * Response 예시:
 * {
 *   "code": 1000,
 *   "status": 200,
 *   "message": "요청에 성공하였습니다.",
 *   "result": {
 *     "mentosTitle": "...",
 *     "mentosAt": "2025-09-08",
 *     "mentosTime": "12:00",
 *     "availableDays": "MON,TUE,...",
 *     "price": 50000,
 *     "chatRoomId": 123   // (백엔드가 내려주는 필드명은 팀 합의에 따름)
 *   }
 * }
 */
export type PaymentSuccessReq = {
  mentosSeq: number;
  mentosAt: string; // "YYYY-MM-DD"
  mentosTime: string; // "HH:mm"
};

export type PaymentSuccessRes = {
  code: number;
  status: number;
  message: string;
  result?: {
    mentosTitle?: string;
    mentosAt?: string;
    mentosTime?: string;
    availableDays?: string;
    price?: number;
    // 방 아이디는 백 응답 키가 뭘로 오든 최대한 커버
    chatRoomId?: number | string;
    roomId?: number | string;
    chatRoomSeq?: number | string;
  };
};

export async function confirmPaymentSuccess(memberSeq: number, body: PaymentSuccessReq) {
  return axiosAuth<PaymentSuccessRes>({
    url: `/payments/success/${memberSeq}/init`,
    method: "POST", // 명세서에 맞춤
    data: body,
  });
}
