import type { GetMentosList, GetMentosListResponse } from "@entities/mentos";
import { http } from "@shared/api";

export async function getMentosList(params: GetMentosList) {
  const { categoryId, limit, cursor } = params;
  const { data } = await http.get<GetMentosListResponse>(`/mentos/category/${categoryId}`, {
    params: { limit, cursor },
  });
  return data;
}
