// src/shared/api/payments.ts
import { http } from "@api/https"; // ✅ 팀 컨벤션: https.ts만 사용

export type InitMentosPaymentReq = {
  mentosSeq: number; // Long
  mentosAt: string; // "YYYY-MM-DD"
  mentosTime: string; // "HH:mm"
};

export type InitMentosPaymentRes = {
  code: number;
  status: number;
  message: string;
  result: {
    orderId: string;
    amount: number;
    orderName: string;
    successUrl: string; // ex) http://localhost:3000/
    failUrl: string; // ex) http://localhost:9999/payments/fail
  };
};

/** 결제 init */
export async function initMentosPayment(memberSeq: number, body: InitMentosPaymentReq) {
  // baseURL이 이미 .../api 로 끝나도록 https.ts에서 설정되어 있으므로 "/mentos/..."만 작성
  const { data } = await http.post<InitMentosPaymentRes>(
    `/mentos/payments/${memberSeq}/init`,
    body,
  );
  return data;
}
