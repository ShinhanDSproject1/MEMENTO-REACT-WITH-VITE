// src/shared/api/auth.ts
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";
const auth = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

// ── DTO ─────────────────────────────────────────────
export type SignupMentoDto = {
  memberId: string;
  memberPwd: string;
  memberName: string;
  memberPhoneNumber: string; // "010-1234-5678"
  memberBirthDate: string; // "yyyy-MM-dd"
  certificationName?: string; // 예: "금융자격증" (파일이 있으면 같이 보냄)
};

export type ApiBaseResponse = {
  code: number;
  status: number;
  message: string;
};

// ── 멘토 회원가입 (자격증 유/무 모두 지원) ─────────────
export async function signupMento(
  dto: SignupMentoDto,
  file?: File | null,
): Promise<ApiBaseResponse> {
  // form-data 구성: requestDto(텍스트) + imageFile(파일)
  const form = new FormData();
  form.append("requestDto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
  if (file) form.append("imageFile", file); // 파일 없으면 생략

  const { data } = await auth.post<ApiBaseResponse>("/auth/signup/mento", form, {
    headers: {
      /* Content-Type은 브라우저가 boundary 포함해서 자동 설정 */
    },
  });
  return data;
}

// ── 멘티 회원가입 (파일 없음 가정) ─────────────
export type SignupMentiDto = {
  memberId: string;
  memberPwd: string;
  memberName: string;
  memberPhoneNumber: string;
  memberBirthDate: string; // "yyyy-MM-dd"
};

export async function signupMenti(dto: SignupMentiDto): Promise<ApiBaseResponse> {
  const { data } = await auth.post<ApiBaseResponse>("/auth/signup/menti", dto);
  return data;
}
