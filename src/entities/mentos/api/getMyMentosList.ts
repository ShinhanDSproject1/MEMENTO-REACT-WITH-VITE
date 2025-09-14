// src/entities/mentos/api/getMyMentos.ts
import type { GetMyMentosResponse } from "@entities/mentos";
import { http } from "@shared/api";

export async function getMyMentos(limit = 5, cursor?: number) {
  const { data } = await http.get<GetMyMentosResponse>(`/mypage/my-mentos-list`, {
    params: { limit, cursor },
  });
  return data;
}
