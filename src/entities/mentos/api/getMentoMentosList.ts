import type { MentorMentosListResponse, MentorMentosListResult } from "@entities/mentos";
import { http } from "@shared/api";

/** 멘토 전용: 나의 멘토스 목록 (무한스크롤용) */
export async function getMentoMentosList(
  limit = 5,
  cursor?: number,
): Promise<MentorMentosListResult> {
  const { data } = await http.get<MentorMentosListResponse>("/mentos/my-list", {
    params: { limit, cursor },
  });
  // 안전 fallback
  return data.result ?? { content: [], hasNext: false, nextCursor: undefined };
}
