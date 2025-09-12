import type { LoginInput, LoginSuccess } from "@entities/auth";
import { http } from "@shared/api";

// * 로그인
export async function login(input: LoginInput): Promise<LoginSuccess> {
  const { data } = await http.post<LoginSuccess>(
    `/auth/login/${input.userType}`,
    {
      userid: input.userid,
      password: input.password,
    },
    { headers: { "Content-Type": "application/json" } },
  );
  return data;
}
