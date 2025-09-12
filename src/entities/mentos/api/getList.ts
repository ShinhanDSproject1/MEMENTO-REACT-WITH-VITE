import { http } from "@shared/api";
import type { GetMentosListParams, GetMentosListResponse } from "../model/types";

// 예: /api/mentos?category=consumption&page=1&size=20
export async function getMentosList(params: GetMentosListParams) {
  const { category, page, size } = params;
  const { data } = await http.get<GetMentosListResponse>("/mentos", {
    params: { category, page, size },
  });
  return data;
}
