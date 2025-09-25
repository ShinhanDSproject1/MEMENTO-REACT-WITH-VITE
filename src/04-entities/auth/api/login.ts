import type { LoginInput, LoginSuccess } from "@entities/auth";
import { http } from "@/05-shared/api";

export async function login(input: LoginInput): Promise<LoginSuccess> {
  const { data } = await http.post<LoginSuccess>(
    `/auth/login/${input.userType}`,
    { memberId: input.memberId, memberPwd: input.memberPwd },
    { headers: { "Content-Type": "application/json" } },
  );
  return data;
}
