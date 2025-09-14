import type { GetMentosList, GetMentosListResponse } from "@entities/mentos";
import { http } from "@shared/api";

/**
 * 멘토스 목록 조회
 * GET /api/mentos/category/{id}?limit=10&cursor=20
 */
export async function getMentosList(params: GetMentosList) {
  const { categoryId, limit, cursor } = params;
  const { data } = await http.get<GetMentosListResponse>(`/mentos/category/${categoryId}`, {
    params: { limit, cursor },
  });
  return data;
}
