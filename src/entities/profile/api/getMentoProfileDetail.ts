import { http } from "@/shared/api";
import type { GetMentoProfileDetailSuccess, MentoProfileDetail } from "../model/types";

export async function getMentoProfileDetail(): Promise<MentoProfileDetail> {
  const { data } = await http.get<GetMentoProfileDetailSuccess>("/mento/mento-profiles");
  if (data.code !== 1000) {
    throw new Error(data.message || "멘토 프로필 조회 실패");
  }
  return data.result;
}
