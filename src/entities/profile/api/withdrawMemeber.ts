import type { WithdrawSuccess } from "@entities/profile";
import { http } from "@shared/api";

export async function withdrawMember(): Promise<WithdrawSuccess> {
  const { data } = await http.patch<WithdrawSuccess>("/mypage/withdraw", {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}
