import type { UpdateProfileInput, UpdateProfileSuccess } from "@entities/profile";
import { http } from "@shared/api";

export async function updateMyProfile(input: UpdateProfileInput): Promise<UpdateProfileSuccess> {
  const { data } = await http.patch<UpdateProfileSuccess>("/mypage/profile", input, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}
