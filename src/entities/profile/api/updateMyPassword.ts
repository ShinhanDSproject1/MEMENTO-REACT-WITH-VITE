import type { UpdatePasswordInput, UpdatePasswordSuccess } from "@entities/profile";
import { http } from "@shared/api";

export async function updateMyPassword(input: UpdatePasswordInput): Promise<UpdatePasswordSuccess> {
  const { data } = await http.patch<UpdatePasswordSuccess>("/mypage/password", input, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}
