import type { MentorMentosListResponse, MentorMentosListResult } from "@entities/mentos";
import { http } from "@shared/api";

export async function getMentoMentos(limit = 5, cursor?: number): Promise<MentorMentosListResult> {
  const { data } = await http.get<MentorMentosListResponse>("/mentos/my-list", {
    params: { limit, cursor },
  });
  return data.result;
}
