import { http } from "@/shared/api/https";

export type MenteeSignupReq = {
  memberId: string;
  memberPwd: string;
  memberName: string;
  memberPhoneNumber: string;
  memberBirthDate: string; // "YYYY-MM-DD"
};

export async function signupMentee(req: MenteeSignupReq) {
  // 멱등키: 고정값 or 매 요청마다 유니크(여기선 명세값 사용)
  const idemKey = "testIdempotencyKey";

  const { data } = await http.post("/auth/signup/menti", req, {
    headers: {
      "Content-Type": "application/json",
      "Idem-Key": idemKey,
    },
  });
  return data; // { code, status, message } 예상
}
