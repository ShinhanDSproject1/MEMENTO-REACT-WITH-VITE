import { http } from "@/05-shared";
import type { MentorReviewsResult } from "../model/types";

export async function getMentoReviews(limit = 3, cursor?: number): Promise<MentorReviewsResult> {
  const { data } = await http.get(`/mento/reviews`, { params: { limit, cursor } });
  const { result } = data as { result: MentorReviewsResult };
  return result;
}
