import { http } from "@/05-shared/api";
import type { GetProfileSuccess } from "@entities/profile";

export async function getMyProfile(): Promise<GetProfileSuccess> {
  const { data } = await http.get<GetProfileSuccess>("/mypage/profile");
  return data;
}
